import toast from 'react-hot-toast';

export type ToastProps = {
    text: string;
    icon: string;
    type?: 'success' | 'error';
  };
  
  export const notify = ({ text, icon, type = 'success' }: ToastProps) => {
    toast[type](text, {
      duration: 4000,
      icon: icon,
      style: {
        background: type === 'error' ? '#f44336' : '#4CAF50', 
        color: '#fff',
        fontWeight: 'bold',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };