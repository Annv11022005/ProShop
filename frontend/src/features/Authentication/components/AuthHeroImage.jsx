export default function AuthHeroImage({ srcLight, srcDark }) {
  return (
    <section className='hidden min-w-0 items-center justify-center lg:flex lg:justify-end'>
      <div className='w-full overflow-hidden rounded-2xl'>
        <img
          alt=''
          aria-hidden='true'
          loading='eager'
          className='h-96 w-full object-cover sm:h-136 lg:h-[78svh] lg:max-h-232 xl:h-[82svh] xl:max-h-248 dark:hidden'
          src={srcLight}
        />
        <img
          alt=''
          aria-hidden='true'
          loading='eager'
          className='hidden h-96 w-full object-cover sm:h-136 lg:h-[78svh] lg:max-h-232 xl:h-[82svh] xl:max-h-248 dark:block'
          src={srcDark}
        />
      </div>
    </section>
  );
}
