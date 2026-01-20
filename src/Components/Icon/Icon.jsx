import { FaRegCircle, FaTimes } from 'react-icons/fa';
import "./Icon.css"

function Icon({ name }) {
    if (name == "circle") {
        return <div className='icon icon-circle' >
            <FaRegCircle />
        </div>
    } else if (name == "cross") {
        return <div className='icon icon-cross' >
            <FaTimes />
        </div>
    } else {
        return <div className="icon icon-empty"></div>
    }
}

export default Icon;