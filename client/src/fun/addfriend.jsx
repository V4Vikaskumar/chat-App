import axios from "../Apis/Api";
import { find } from "../Apis/Auth";
export async function Addfriend({newfriend,user,setMessages}) {
    const nameofFriend = newfriend.current.value;

    const isAvailble = await find({ nameofFriend });
    if (!isAvailble) return alert('User Not Found');

    await axios.post('/api/start/conversation', {
      receiverId: isAvailble.id,
      asp: user
    });

    setMessages([]);
    newfriend.current.value = '';
  }