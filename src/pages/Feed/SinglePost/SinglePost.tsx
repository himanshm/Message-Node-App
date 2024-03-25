import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Image from '../../../components/Image/Image';
import './SinglePost.css';

interface PostData {
  title: string;
  author: string;
  date: string;
  image: string;
  content: string;
}

const SinglePost = () => {
  const [postData, setPostData] = useState<PostData>({
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  });

  const { postId } = useParams<{ postId: string }>();

  useEffect(() => {
    // Assuming 'URL' will be replaced with your actual endpoint
    fetch(`URL/${postId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then((resData) => {
        setPostData({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          image: resData.post.imageUrl, // Assuming 'imageUrl' is the correct field
          content: resData.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postId]);

  return (
    <section className='single-post'>
      <h1>{postData.title}</h1>
      <h2>
        Created by {postData.author} on {postData.date}
      </h2>
      <div className='single-post__image'>
        <Image contain imageUrl={postData.image} />
      </div>
      <p>{postData.content}</p>
    </section>
  );
};

export default SinglePost;
