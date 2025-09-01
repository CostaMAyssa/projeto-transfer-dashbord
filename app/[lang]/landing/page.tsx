import LandingPage from "../landing-page"

export function generateStaticParams() {
  return [
    { lang: 'pt' },
    { lang: 'en' },
    { lang: 'es' },
  ];
}

export default function Page({ params }: { params: { lang: string } }) {
  return <LandingPage params={params} />
}
