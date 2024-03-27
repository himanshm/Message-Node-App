import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Image from '../../../components/Image/Image';
import './SinglePost.css';
import { useAuth } from '../../../hooks/useAuth';

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
  const { getToken } = useAuth();
  const token = getToken();
  console.log(token);

  const { postId } = useParams<{ postId: string }>();

  useEffect(() => {
    async function fetchPostData(postId: string | undefined) {
      try {
        const res = await fetch(`http:localhost:8080/feed/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }

        const resData = await res.json();
        setPostData({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          image: `http:localhost:8080/${resData.post.imageUrl}`,
          content: resData.post.content,
        });
      } catch (err) {
        console.log(err);
      }
    }

    fetchPostData(postId);
  }, [postId, token]);

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
