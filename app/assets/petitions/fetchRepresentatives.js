import { fetchData } from "./fetchData";

const fetchRepresentatives = async (clientId, postcode, setMp, setSenator, setShowLoadSpin) => {
    //const datos = await fetchData(petitionMethod, backendURLBase, endpoint, clientId, params)
    console.log('fetchReps')
    const requestOptions = {
        method: "GET",
        redirect: 'follow',
    }
    const datos = await fetch( `https://app.overton.services/dashboardContent/find-mp-demo/?clientId=${clientId}&postcode=${postcode}`,requestOptions)
    const response =  await datos.json() 
    let query = response.mps;  
    let fill = await query.filter((el) => el.govt_type == 'Federal MPs');
    setMp(fill);
    setSenator(response.data)
    setShowLoadSpin(false)

}


export{
    fetchRepresentatives
}
