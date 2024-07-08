import {auth, googleProvider} from '../../firebase.js'
import { deleteUser, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async ()=>{
    try{
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if(email === 'ce22btech11050@iith.ac.in'){
        alert('authorized user');
        navigate('/');
      } else {
        alert('unauthorized user');
        navigate('/not-authorized');
        const user = auth.currentUser;
        auth.signOut();
        await deleteUser(user);
      }
    } catch(err){
      alert('some error occored');
      console.log(err);
    }
  }
  return (
    <div className="dark flex items-center justify-center h-screen bg-gray-900">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
        </div>
        <div className="space-y-4">
          <button onClick={handleLogin}className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white py-2 px-4 rounded flex items-center justify-center">
            <ChromeIcon className="mr-2 h-5 w-5" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  )
}

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}
