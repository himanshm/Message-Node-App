import React, { useState, useEffect, useCallback, FormEvent } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import { useAuth } from '../../hooks/useAuth';

interface PostData {
  _id: string;
  title: string;
  content: string;
  creator: { name: string };
  createdAt: string;
  imageUrl?: string;
}

const Feed: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState<PostData | undefined>(undefined);
  const [status, setStatus] = useState('');
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useAuth();

  const token = getToken();
  console.log(token);

  const fetchStatus = async () => {
    try {
      const res = await fetch('URL/status');
      if (res.status !== 200) {
        throw new Error('Failed to fetch user status.');
      }
      const resData = await res.json();
      setStatus(resData.status);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch status.')
      );
    }
  };

  const loadPosts = useCallback(
    (direction?: string) => {
      if (!token) return;

      const fetchPosts = async () => {
        setPostsLoading(true);
        const page =
          direction === 'next'
            ? postPage + 1
            : direction === 'previous'
            ? postPage - 1
            : postPage;
        setPostPage(page);

        try {
          const res = await fetch(
            `http://localhost:8080/feed/posts?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.status !== 200) {
            throw new Error('Failed to fetch posts.');
          }
          const resData = await res.json();
          setPosts(
            resData.posts.map((post: PostData) => ({
              ...post,
              imagePath: post.imageUrl || 'default-path.jpg',
            }))
          );
          setTotalPosts(resData.totalItems);
        } catch (err) {
          console.log(err);
          setError(
            err instanceof Error ? err : new Error('Failed to fetch posts.')
          );
        } finally {
          setPostsLoading(false);
        }
      };

      fetchPosts();
    },
    [postPage, token]
  );

  useEffect(() => {
    fetchStatus();
    loadPosts();
  }, [loadPosts]);

  const statusUpdateHandler = (event: FormEvent) => {
    event.preventDefault();
    console.log('Updating status...');
  };

  const newPostHandler = () => setIsEditing(true);

  const startEditPostHandler = (postId: string) => {
    const loadedPost = posts.find((p) => p._id === postId);
    if (loadedPost) {
      setIsEditing(true);
      setEditPost({
        ...loadedPost,
        imageUrl: loadedPost.imageUrl || 'default-image-path.jpg',
      });
    } else {
      setIsEditing(false);
      setEditPost(undefined);
    }
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(undefined);
  };

  const finishEditHandler = async (postData: {
    title: string;
    content: string;
    image: File | string;
  }) => {
    setEditLoading(true);
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (typeof postData.image === 'object') {
      formData.append('image', postData.image);
    }

    let url = 'http://localhost:8080/feed/posts';
    let method = 'POST';

    if (editPost) {
      url = `http://localhost:8080/feed/post/${editPost._id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Creating or editing a post failed!');
      }
      const resData = await res.json();

      const updatedPosts = [...posts];
      if (editPost) {
        const postIndex = posts.findIndex((p) => p._id === editPost._id);
        updatedPosts[postIndex] = resData.post;
      } else {
        if (posts.length >= 10) {
          updatedPosts.pop();
        }
        updatedPosts.unshift(resData.post);
      }
      setPosts(updatedPosts);
      setIsEditing(false);
      setEditPost(undefined);
      setEditLoading(false);
    } catch (err) {
      console.error(err);
      setIsEditing(false);
      setEditPost(undefined);
      setEditLoading(false);
      setError(
        err instanceof Error ? err : new Error('Failed to process the post.')
      );
    }
  };

  const deletePostHandler = (postId: string) => {
    setPostsLoading(true);
    fetch(`http:localhost:8080/feed/post/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to delete the post.');
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData.message);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
        setPostsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setPostsLoading(false);
        setError(
          err instanceof Error ? err : new Error('Deleting post failed.')
        );
      });
  };

  const errorHandler = () => setError(null);

  return (
    <>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className='feed__status'>
        <form onSubmit={statusUpdateHandler}>
          <Input
            type='text'
            placeholder='Your status'
            control='input'
            onChange={(e) => setStatus(e.target.value)} // Simplified for demonstration
            value={status}
          />
          <Button mode='flat' type='submit'>
            Update
          </Button>
        </form>
      </section>
      <section className='feed__control'>
        <Button mode='raised' design='accent' onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className='feed'>
        {postsLoading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading ? (
          <p style={{ textAlign: 'center' }}>No posts found.</p>
        ) : null}
        {!postsLoading && (
          <Paginator
            onPrevious={() => loadPosts('previous')}
            onNext={() => loadPosts('next')}
            lastPage={Math.ceil(totalPosts / 2)} // Assuming 2 posts per page
            currentPage={postPage}
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString('en-US')}
                title={post.title}
                // Uncomment and adjust if using image and content
                // image={post.imageUrl}
                // content={post.content}
                onStartEdit={() => startEditPostHandler(post._id)}
                onDelete={() => deletePostHandler(post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </>
  );
};

export default Feed;
