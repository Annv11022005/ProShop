import asyncHandler from '../middleware/asyncHandler.js';
import Address from '../model/addressModel.js';

// @desc get all Address
// GET /api/address
export const getAddress = asyncHandler(async (req, res) => {
  const address = await Address.find({ user: req.user._id });

  res.status(200).json(address);
});

// @desc get address default
// GET /api/address
export const getAddressDefault = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    user: req.user._id,
    isDefault: true,
  });

  if (address) {
    res.status(200).json(address);
  } else {
    res.status(404);
    throw new Error('Not default address found');
  }
});

// @desc create address
// POST /api/address
export const createAddress = asyncHandler(async (req, res) => {
  const { name, phone, address, city, postalCode, country } = req.body;

  const count = await Address.countDocuments({ user: req.user._id });

  const newAddress = new Address({
    user: req.user._id,
    name: name,
    phone: phone,
    address: address,
    city: city,
    postalCode: postalCode,
    country: country,
    isDefault: count === 0,
  });

  const createAddress = await newAddress.save();

  res.status(201).json(createAddress);
});

// @desc update address default
// PUT /api/address/:id/default
export const updateAddressDefault = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    user: req.user._id,
    _id: req.params.id,
  });

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (address.isDefault) {
    return res.status(200).json(address);
  }

  await Address.updateMany(
    { user: req.user._id },
    { $set: { isDefault: false } },
  );

  address.isDefault = true;

  const updateAddress = await address.save();

  res.status(200).json(updateAddress);
});

// @desc update Address
// PUT /api/address/:id
export const updateAddress = asyncHandler(async (req, res) => {
  const currentAddress = await Address.findOne({
    user: req.user._id,
    _id: req.params.id,
  });

  const { name, phone, address, city, postalCode, country, isDefault } =
    req.body;

  if (currentAddress) {
    currentAddress.name = name ?? currentAddress.name;
    currentAddress.phone = phone ?? currentAddress.phone;
    currentAddress.address = address ?? currentAddress.address;
    currentAddress.city = city ?? currentAddress.city;
    currentAddress.postalCode = postalCode ?? currentAddress.postalCode;
    currentAddress.country = country ?? currentAddress.country;

    if (isDefault === true && !currentAddress.isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { $set: { isDefault: false } },
      );

      currentAddress.isDefault = true;
    }
    const updateAddress = await currentAddress.save();
    res.status(200).json(updateAddress);
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

// @desc delete Address
// POST /api/address/:id
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (address) {
    const wasDefault = address.isDefault;

    await address.deleteOne();

    if (wasDefault) {
      const anotherAddress = await Address.findOne({ user: req.user._id });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }
    res.status(200).json({ message: 'address deleted' });
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});
