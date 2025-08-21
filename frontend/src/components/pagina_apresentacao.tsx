import Logo from "../../public/icons/logo.png";

export function PageApresentacao() {
  return (
    <section className="relative w-[70vw] h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/bg.png')] bg-cover bg-center blur-lg scale-110" />

      <div className="relative z-10 flex items-center px-[8rem] py-[4rem]">
        <img src={Logo} alt="Logo Guard" className="h-8" />
        <h1 className="ml-2 font-bold text-white text-[1.5rem]">GUARD</h1>
      </div>
    </section>
  );
}
