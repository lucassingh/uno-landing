/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Sistema +uno pospuesto (2026-10-24): la página vive en app/_system (carpeta privada, no se
  // rutea) y cualquier link viejo a /system cae en el home. Temporal (307), no permanente: el
  // día que vuelva, se borra esto y se renombra la carpeta a app/system.
  async redirects() {
    return [{ source: "/system", destination: "/", permanent: false }];
  },
};

export default nextConfig;
