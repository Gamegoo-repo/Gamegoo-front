interface ChatDateProps {
  children: React.ReactNode;
}

const ChatDate = (props:children)=>{
    return(
        let displayDate = false;
        let today = '';
        
        const isCreated = new Date(value.created_at);
        isCreated.setHours(isCreated.getHours() - 9);

      if (index !== chats.length - 1) {
          const nextSender = chats[index + 1].sender_index;
          const nextCreated = new Date(chats[index + 1].created_at);
          nextCreated.setHours(nextCreated.getHours() - 9);

          if (isCreated.getDate() !== nextCreated.getDate()) {
              displayDate = true;

              let day = '';
              switch(nextCreated.getDay()) {
                  case 0:
                      day = '일';
                      break;
                  case 1:
                      day = '월';
                      break;
                  case 2:
                      day = '화';
                      break;
                  case 3:
                      day = '수';
                      break;
                  case 4:
                      day = '목';
                      break;
                  case 5:
                      day = '금';
                      break;
                  case 6:
                      day = '토';
                      break;
                  default:
                        break;
              }
              today = `${nextCreated.getMonth() + 1}월 ${nextCreated.getDate()}일 ${day}요일`;
          }

          if (nextSender === value.sender_index && nextTimeValue === timeValue)
                displayTime = false;
      }
    )
};

export default ChatDate;