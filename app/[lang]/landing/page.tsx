import LandingPage from "../landing-page"

export default function Page({ params }: { params: { lang: string } }) {
  return <LandingPage params={params} />
}
