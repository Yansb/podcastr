import api from "../services/api"

export default function Home(props) {
  console.log(props)
  return (
   <h1>Index</h1>
  )
}


export async function getStaticProps(){
  const response = await api.get('episodes');

  return{
    props: {
      episodes: response.data,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}