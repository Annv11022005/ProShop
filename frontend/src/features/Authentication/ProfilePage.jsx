import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOrderHistory } from '../order/hooks/useOrders';
import { setCredentials } from './authSlice';
import { useProfileMutation } from './hooks/useProfile';
import MyOrders from './components/MyOrders';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteAddress,
  useGetAllAddress,
  useGetDefaultAddress,
  useUpdateDefaultAddress,
} from '../address/hooks/useAddress';

import { Button } from '@/components/ui/button';
import Col from '@/components/ui/Col';
import Row from '@/components/ui/Row';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Package,
  User,
  Check,
  Truck,
  Heart,
  BellRing,
  CircleX,
} from 'lucide-react';
import { Message } from '@/components/AlertMessage';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormInformation from './components/FormInformation';
import { formatCurrency } from '@/lib/utils';
import { useGetWishlist } from './hooks/useWishlist';
import Product from '@/components/ui/Product';

const navTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'notifications', label: 'Notifications', icon: BellRing },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [open, setOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const avatar = userInfo?.name.charAt(0);
  const memberSince = new Date(userInfo.createdAt).getFullYear();

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isPending: pendingDelete, deletedAddress } = useDeleteAddress();

  const { isPending: pendingGet, allAddress } = useGetAllAddress();

  const { isPending: pendingWishlist, wishlist } = useGetWishlist();

  const {
    isPending: pendingDefault,
    error: errDefault,
    currentAddress,
    refetch,
  } = useGetDefaultAddress();

  const {
    isPending: pendingUp,
    error: errUp,
    replaceDefaultAddress,
  } = useUpdateDefaultAddress();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPending, profileUser } = useProfileMutation();
  const { isPending: pendingMyOrder, error, myOrders } = useOrderHistory();
  const OrderedAmount = myOrders?.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  );
  const latestOrder = myOrders?.reduce(
    (latest, order) =>
      new Date(order.createdAt) > new Date(latest.createdAt) ? order : latest,
    myOrders[0],
  );

  if (!userInfo || pendingDefault || pendingGet) return <Spinner />;

  if (errDefault) {
    return <Message>Failed to load address, try again later</Message>;
  }

  if (errUp) {
    return <Message>{errUp?.message}</Message>;
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password do not match');
    } else {
      try {
        const res = await profileUser({
          _id: userInfo._id,
          name,
          email,
          password,
        });

        dispatch(setCredentials(res));
        toast.success('Profile update successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'update fail');
      }
    }
  }

  function updateDefaultAddressHandler(id) {
    replaceDefaultAddress(id, {
      onSuccess: () => {
        toast.success('Set as default address', {
          position: 'top-center',
        });
        refetch();
        setOpen(false);
      },
      onError: (err) =>
        toast(err.response?.data?.message, { position: 'top-center' }),
    });
  }

  function deleteAddressHandler(id) {
    deletedAddress(id, {
      onSuccess: () => {
        toast.success('Address deleted', {
          position: 'top-center',
        });
        refetch();
      },
      onError: (err) =>
        toast(err.response?.data?.message, { position: 'top-center' }),
    });
  }

  return (
    <Row template='lg:grid-cols-[0.7fr_2fr]' className='gap-3'>
      {/* Sidebar Profile */}
      <Col fluid>
        <div className='flex flex-col h-79 gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card shadow-xs'>
          {/* User info  */}
          <div className='flex items-center gap-3 pb-2 border-b border-border/50'>
            <div className='w-12 h-12 rounded-full bg-bg-blue text-blue-avt font-bold text-base flex items-center justify-center shrink-0 '>
              {avatar}
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='font-bold text-base text-foreground truncate'>
                {userInfo?.name}
              </h3>
              <p className='text-xs text-muted-foreground truncate'>
                {userInfo?.email}
              </p>
            </div>
          </div>

          <nav className='flex flex-col gap-3'>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer w-full text-left ${
                    isActive
                      ? 'bg-bg-blue text-blue-avt font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-blue-avt' : 'text-muted-foreground'}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </Col>

      <Col fluid>
        {activeTab === 'wishlist' && (
          <div>
            {pendingWishlist ? (
              <Spinner />
            ) : !wishlist || wishlist.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl text-center text-muted-foreground'>
                <Heart size={48} className='mb-3 text-muted-foreground/40' />
                <h3 className='text-base font-semibold text-foreground'>
                  Your wishlist is empty.
                </h3>
                <p className='text-xs text-muted-foreground mt-1'>
                  Click the heart icon on the products to save them to your
                  favorites list!
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-[380px_380px] gap-4'>
                {wishlist.map((item) => (
                  <Product key={item._id} product={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            {/* Quick facts */}
            <div className='flex flex-row mb-5 gap-7 justify-between'>
              <div className='flex flex-col items-center gap-1 justify-center w-60 h-30 p-3 border border-border rounded-lg shadow-xs'>
                <h2 className='text-lg font-medium text-center'>
                  Total Orders
                </h2>
                <p className='text-3xl font-semibold'>
                  {Number(myOrders?.length)}
                </p>
              </div>
              <div className='flex flex-col items-center gap-1 justify-center w-60 h-30 p-3 border border-border rounded-lg shadow-xs'>
                <h2 className='text-lg font-medium text-center'>
                  Ordered Amount
                </h2>

                <p className='text-3xl font-semibold'>
                  {formatCurrency(OrderedAmount)}
                </p>
              </div>
              <div className='flex flex-col items-center gap-1 justify-center w-60 h-30 p-3 border border-border rounded-lg shadow-xs'>
                <h2 className='text-lg font-medium text-center'>
                  Member Since
                </h2>

                <p className='text-3xl font-semibold'>{memberSince}</p>
              </div>
            </div>

            {/* Address */}
            <Card className='rounded-lg shadow-sm'>
              <CardHeader>
                <CardTitle className='font-semibold'>
                  Shipping Address Default
                </CardTitle>
                <CardDescription>
                  {allAddress?.length === 0
                    ? 'You do not have any addresses.'
                    : ''}
                  {currentAddress && (
                    <>
                      {currentAddress.name}, {currentAddress.phone},
                      {currentAddress.address}, {currentAddress.city},{' '}
                      {currentAddress.postalCode}, {currentAddress.country}
                    </>
                  )}
                </CardDescription>
                <CardAction className='my-auto'>
                  <Button
                    variant='link'
                    onClick={() => {
                      if (!currentAddress) {
                        navigate('/shipping', { state: { action: 'create' } });
                      } else {
                        setOpen(true);
                      }
                    }}
                  >
                    {!currentAddress ? 'Create Address' : 'Change Address'}
                  </Button>
                </CardAction>
              </CardHeader>

              <CardFooter>
                <Button
                  onClick={() =>
                    navigate('/shipping', { state: { action: 'create' } })
                  }
                >
                  Create New Address
                </Button>
              </CardFooter>
            </Card>

            {/* Dialog Address */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className='sm:max-w-155 p-6 rounded-sm bg-popover text-popover-foreground shadow-xl border border-border outline-none'>
                <DialogHeader className='flex flex-row items-center justify-between pb-1 space-y-0'>
                  <DialogTitle className='text-lg sm:text-xl font-bold text-foreground'>
                    Delivery address
                  </DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-3.5 my-2 max-h-[65vh] overflow-y-auto pr-1'>
                  {allAddress?.map((addr) => {
                    const isDefault = currentAddress?._id === addr._id;
                    const addressString = [
                      addr.phone,
                      addr.address,
                      addr.city,
                      addr.postalCode,
                      addr.country,
                    ]
                      .filter(Boolean)
                      .join(', ');

                    return (
                      <div
                        key={addr._id}
                        className={`flex items-start justify-between gap-3 p-4 sm:p-5 rounded-sm border transition-colors ${
                          isDefault
                            ? 'border-primary/40 bg-card shadow-xs'
                            : 'border-border bg-card hover:border-muted-foreground/40'
                        }`}
                      >
                        {/* Left side: Pin icon + Title/Badge + Address */}
                        <div
                          className='flex items-start gap-3 flex-1 cursor-pointer select-none'
                          onClick={() => {
                            if (!isDefault && !pendingUp) {
                              updateDefaultAddressHandler(addr._id);
                            }
                          }}
                        >
                          <MapPin
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              isDefault
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1 flex-wrap'>
                              <span className='font-bold text-base text-foreground'>
                                {addr.name || 'Địa chỉ'}
                              </span>
                              {isDefault && (
                                <span className='bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full'>
                                  Default
                                </span>
                              )}
                            </div>
                            <p className='text-sm text-muted-foreground leading-relaxed wrap-break-word font-normal'>
                              {addressString}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Edit & Delete buttons */}
                        <div className='flex items-center gap-2 shrink-0 pt-0.5'>
                          <button
                            type='button'
                            title='Edit'
                            className='p-2 sm:p-2.5 rounded-xl border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer'
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/shipping', {
                                state: { action: 'update', address: addr },
                              });
                              setOpen(false);
                            }}
                          >
                            <Pencil className='w-4 h-4' />
                          </button>
                          <button
                            type='button'
                            title='Delete'
                            disabled={pendingDelete}
                            className='p-2 sm:p-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddressHandler(addr._id);
                            }}
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type='button'
                  className='w-full py-3 px-4 rounded-sm border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer'
                  onClick={() => {
                    navigate('/shipping', { state: { action: 'create' } });
                    setOpen(false);
                  }}
                >
                  <Plus className='w-4 h-4' />
                  Add a new address
                </button>
              </DialogContent>
            </Dialog>

            {/* Information */}
            <FormInformation
              userInfo={userInfo}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              submitHandler={submitHandler}
              isPending={isPending}
            />

            {/* Recent orders */}
            <div className='p-2 pb-5 bg-card border border-border mt-5 shadow-sm rounded-lg'>
              <h2 className='text-lg font-medium text-primary px-5 py-3'>
                Recent Orders
              </h2>
              {latestOrder ? (
                <div className='flex gap-4 justify-between'>
                  <div className='flex gap-5'>
                    <img
                      src={latestOrder.orderItems[0].image}
                      alt={latestOrder.orderItems[0].name}
                      className='w-35 h-20 object-cover'
                    />

                    <div className='flex justify-around flex-col'>
                      <h2 className='text-lg font-semibold text-primary'>
                        {latestOrder.orderItems[0].name}
                      </h2>
                      <div className='flex gap-5 text-sm text-muted-foreground'>
                        <p>
                          {new Date(latestOrder.createdAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </p>
                        <p>{formatCurrency(latestOrder.totalPrice)}</p>
                      </div>
                    </div>
                  </div>

                  {latestOrder.isDelivered === true ? (
                    <div className='my-auto flex gap-2 justify-center items-center bg-green-rating/20 px-3 py-1 rounded-3xl text-green-900 font-semibold'>
                      <Check size={16} />
                      Delivered
                    </div>
                  ) : latestOrder.isCancelled === true ? (
                    <div className='my-auto flex gap-2 justify-center items-center bg-red-50 px-3 py-1 rounded-3xl text-[#DF301C] font-semibold'>
                      <CircleX size={16} />
                      Has Been Cancelled
                    </div>
                  ) : (
                    <div className='my-auto flex gap-2 justify-center items-center bg-red-50 px-3 py-1 rounded-3xl text-[#DF301C] font-semibold'>
                      <Truck size={16} />
                      On the way
                    </div>
                  )}

                  <Button
                    size='lg'
                    variant='outline'
                    className='my-auto mr-10'
                    onClick={() => {
                      navigate(`/order/${latestOrder._id}`);
                    }}
                  >
                    Detail
                  </Button>
                </div>
              ) : (
                <p className='text-center text-md font-normal text-muted-foreground'>
                  You don't have any orders yet!
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className='w-full text-center mb-2 uppercase font-semibold'>
              My Orders
            </h2>
            {pendingMyOrder ? (
              <Spinner />
            ) : error ? (
              <Message>{error.message}</Message>
            ) : (
              <MyOrders orders={myOrders} />
            )}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;
