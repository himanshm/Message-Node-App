import React, { useState, useEffect } from 'react';

import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import Input from '../../Form/Input/Input';
import FilePicker from '../../Form/Input/FilePicker';
import Image from '../../Image/Image';
import { required, length } from '../../../util/validators';
import { generateBase64FromImage } from '../../../util/image';

interface FormField {
  value: string;
  valid: boolean;
  touched: boolean;
  validators: ((value: string) => boolean)[];
}

interface PostForm {
  title: FormField;
  image: FormField;
  content: FormField;
}

interface FeedEditProps {
  editing: boolean;
  selectedPost?: { title: string; content: string; imagePath?: string };
  onCancelEdit: () => void;
  onFinishEdit: (post: {
    title: string;
    image: string;
    content: string;
  }) => void;
  loading?: boolean;
}

const POST_FORM: PostForm = {
  title: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  image: {
    value: '',
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: '',
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
};

const FeedEdit: React.FC<FeedEditProps> = ({
  editing,
  selectedPost,
  onCancelEdit,
  onFinishEdit,
  loading,
}) => {
  const [postForm, setPostForm] = useState<PostForm>(POST_FORM);
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editing && selectedPost) {
      const updatedForm = { ...POST_FORM };
      for (const key in updatedForm) {
        if (key in updatedForm) {
          updatedForm[key as keyof PostForm] = {
            ...updatedForm[key as keyof PostForm],
            value: selectedPost[key as keyof typeof selectedPost] as string,
            valid: true,
          };
        }
      }
      setPostForm(updatedForm);
      setFormIsValid(true);
    }
  }, [editing, selectedPost]);

  const postInputChangeHandler = async (
    id: keyof PostForm,
    value: string,
    files?: FileList | null
  ) => {
    if (files) {
      try {
        const b64 = await generateBase64FromImage(files[0]);
        setImagePreview(b64 as string);
      } catch (error) {
        setImagePreview(null);
      }
    }

    let isValid = true;
    const input = id as keyof PostForm;
    for (const validator of postForm[input].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm: PostForm = {
      ...postForm,
      [input]: {
        ...postForm[input],
        valid: isValid,
        value: files ? files[0].name : value,
      },
    };

    let formIsValid = true;
    for (const inputName in updatedForm) {
      formIsValid =
        formIsValid && updatedForm[inputName as keyof PostForm].valid;
    }

    setPostForm(updatedForm);
    setFormIsValid(formIsValid);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    identifier: keyof PostForm,
    files?: FileList | null
  ) => {
    const value = event.target.value;
    postInputChangeHandler(identifier, value, files);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    identifier: keyof PostForm
  ) => {
    const files = event.target.files;
    if (!files) return;
    postInputChangeHandler(identifier, '', files);
  };

  const inputBlurHandler = (input: keyof PostForm) => {
    const updatedForm = {
      ...postForm,
      [input]: {
        ...postForm[input],
        touched: true,
      },
    };

    setPostForm(updatedForm);
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
    onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value,
    };
    onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  return editing ? (
    <>
      <Backdrop open={editing} onClick={cancelPostChangeHandler} />
      <Modal
        title='New Post'
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={!!loading}
      >
        <form>
          <Input
            id='title'
            label='Title'
            control='input'
            onChange={(e) => handleInputChange(e, 'title')}
            onBlur={() => inputBlurHandler('title')}
            valid={postForm.title.valid}
            touched={postForm.title.touched}
            value={postForm.title.value}
          />
          <FilePicker
            id='image'
            label='Image'
            onChange={(e) => handleFileChange(e, 'image')}
            onBlur={() => inputBlurHandler('image')}
            valid={postForm.image.valid}
            touched={postForm.image.touched}
          />
          <div className='new-post__preview-image'>
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id='content'
            label='Content'
            control='textarea'
            rows={5}
            onChange={(e) => handleInputChange(e, 'title')}
            onBlur={() => inputBlurHandler('content')}
            valid={postForm.content.valid}
            touched={postForm.content.touched}
            value={postForm.content.value}
          />
        </form>
      </Modal>
    </>
  ) : null;
};

export default FeedEdit;
