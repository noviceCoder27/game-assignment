import Sidebar from "./components/sidebar/Sidebar"
import styles from './App.module.css'
import RightSection from "./components/rightSection/RightSection";
import { useEffect, useState } from "react";
const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/data";

function App() {

  const [data,setData] = useState(null);
  const [show,setShow] = useState(null);

  useEffect(() => {
    const fetchData = async() => {
      const res = await fetch(backend_url);
      const info = await res.json();
      setData(info);
      const showItems = info?.map(() => false);
      setShow(showItems);
    }
    fetchData();
  },[])
  const displayList = data?.map(item => (
        <p 
        key = {item.id} 
        onMouseOver={() => {
          const updatedItems = show.map((_,index) => index === Number(item.id) ? true: false);
          setShow(updatedItems); 
        }}
        onMouseLeave={() => {
          const items = show.map(() => false);
          setShow(items);
        }}
        >
          {item.title}
        </p>
  ))


  const displayInfo = data?.map(item => (
    <>
    {show[item.id] && <div key = {item.id} className = {styles.info}>
        <img src = {item.img} alt = "Game Image" loading="lazy" height={200} width={500}/>
        <h4>{item.heading.toUpperCase()}</h4>
        <p>{item.para}</p>
        <ul>
          {item.list.map((listItem,index) => (
            <li key = {index}>{listItem}</li>
          ))}
        </ul>
      </div>}
    </>
  ))
  
  return (
    <main className= {styles.main}>
      <Sidebar />
      <section className = {styles.content}>
        <h1 className = {styles.heading}>
          <span>MULTIPLAYER / </span> 
          <br /> 
          <span>QUICKMATCH</span>
        </h1>
        <div className= {styles.mainMenu}>
          <div className = {styles.list}> 
            {displayList}
          </div>
          {displayInfo}
            <RightSection />
        </div>
      </section>
    </main>
  )
}

export default App
