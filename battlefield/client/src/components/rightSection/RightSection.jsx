import { FaPeopleGroup } from 'react-icons/fa6';
import styles from './RightSection.module.css';

const RightSection = () => {
  return (
    <div className = {styles.rightSection}>
        <div>
        <FaPeopleGroup />
        <div className = {styles.plus}>+</div>
        </div>
        <div>
        <div className = {styles.circle}></div>
        <img src = "https://uploads-ssl.webflow.com/6013fff62154adaa4600f932/601ab1585908791f051d4af4_home__friend-picture-MaryJane.png" alt = "Game Image" loading="lazy" height={40} width={40}/>
        </div>
        <div>
        <div className = {styles.circle}></div>
        <img src = "https://uploads-ssl.webflow.com/6013fff62154adaa4600f932/601ab1583424fd3ddf23a848_home__friend-picture-420.png" alt = "Game Image" loading="lazy" height={40} width={40}/>
        </div>
    </div>
  )
}

export default RightSection
