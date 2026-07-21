const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='text-center'>
      <p className='text-primary/60 text-sm'>ProShop &copy; {currentYear}</p>
    </div>
  );
};

export default Footer;
