import Image from './Image';
import './Avatar.css';

interface AvatarProps {
  size: number; // Assuming size is always a number
  image: string; // URL or path to the image
}

const Avatar = ({ size, image }: AvatarProps) => (
  <div className='avatar' style={{ width: `${size}rem`, height: `${size}rem` }}>
    <Image imageUrl={image} />
  </div>
);

export default Avatar;
