import styles from './Sidebar.module.css'
import { ImSwitch } from "react-icons/im";
import { BsFillQuestionCircleFill } from "react-icons/bs";



const Sidebar = () => {
  return (
    <aside className = {styles.sidebar}>
      <section className= {styles.container}>
        <div className= {`${styles.imgContainer} ${styles.img1}`}></div>
        <div className= {`${styles.imgContainer} ${styles.img2}`}></div>
        <div className= {`${styles.currentImg}`}>
          <div className= {`${styles.imgContainer} ${styles.img3}`}></div>
        </div>
        <div className= {`${styles.imgContainer} ${styles.img4}`}></div>
        <div className= {`${styles.imgContainer} ${styles.img5}`}></div>
        <div className= {`${styles.imgContainer} ${styles.img6}`}></div>
        <div className= {`${styles.imgContainer} ${styles.img7}`}></div>
      </section>
      <section className= {styles.switches}>
        <BsFillQuestionCircleFill className= {styles.question}/>
        <ImSwitch />
      </section>
    </aside>
  )
}

export default Sidebar
