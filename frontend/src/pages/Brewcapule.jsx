import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brewCapsule, clearErrors } from '../actions/capsuleAction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Brewcapsule() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [releaseAt, setReleaseAt] = useState(null);
  const [media, setMedia] = useState([]);
  const [friends, setFriends] = useState([]); // List of invited friends
  const [friendInput, setFriendInput] = useState(''); // Input for adding friends
  const [mediaError, setMediaError] = useState('');
  const [dateError, setDateError] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, recieved, capsule, loading } = useSelector((state) => state.capsule);

  useEffect(() => {
    if (recieved) {
      toast.success('Capsule created successfully');
      dispatch(clearErrors());
      setTitle('');
      setDescription('');
      setContent('');
      setVisibility('private');
      setReleaseAt(null);
      setMedia([]);
      setFriends([]);
      setFriendInput('');
      window.scrollTo(0, 0);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
    if (error) {
      toast.error('There was some problem making the capsule');
      dispatch(clearErrors());
    }
  }, [dispatch, error, recieved]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const titleWords = title.trim().split(/\s+/).length;
    const descriptionWords = description.trim().split(/\s+/).length;
    const contentWords = content.trim().split(/\s+/).length;

    if (titleWords > 20) {
      setFormError('Title cannot exceed 20 words.');
      return;
    }
    if (descriptionWords > 50) {
      setFormError('Description cannot exceed 50 words.');
      return;
    }
    if (contentWords > 500) {
      setFormError('Content cannot exceed 500 words.');
      return;
    }

    const releaseAtMs = releaseAt ? releaseAt.getTime() : 0;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('visibility', visibility);
    formData.append('releaseAt', releaseAtMs);

    media.forEach((file) => {
      formData.append('media', file);
    });

    friends.forEach((friend) => {
      formData.append('friends[]', friend);
    });

    setFormError('');
    dispatch(brewCapsule(formData));
  };

  const handleMediaUpload = (files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter((file) => {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      return validImageTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
    });

    if (validFiles.length > 5) {
      setMediaError('Maximum of 5 image files can be uploaded.');
      setMedia(validFiles.slice(0, 5));
    } else if (validFiles.length === 0 && files.length > 0) {
      setMediaError('Only image files (JPG, JPEG, PNG, GIF) are allowed.');
    } else {
      setMediaError('');
      setMedia(validFiles);
    }
  };

  const handleReleaseDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const minReleaseDate = new Date();
    minReleaseDate.setDate(minReleaseDate.getDate() + 7);

    if (selectedDate < minReleaseDate) {
      setDateError('Release date must be at least one week from today.');
      setReleaseAt(null);
    } else {
      setDateError('');
      setReleaseAt(selectedDate);
    }
  };

  const handleAddFriend = () => {
    if (friendInput.trim() && !friends.includes(friendInput.trim())) {
      setFriends((prevFriends) => [...prevFriends, friendInput.trim()]);
      setFriendInput('');
    }
  };

  const handleRemoveFriend = (friendToRemove) => {
    setFriends((prevFriends) => prevFriends.filter((friend) => friend !== friendToRemove));
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md  w-[80%] text-[#283149]">
          <div className="mb-4">
            {/* <label htmlFor="title" className="block font-medium mb-1">
              Title (Max 20 words):
            </label> */}
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title (Max 20 words)'
              className="border rounded-md px-3 py-2 w-full input-box"
              required
            />
          </div>

          <div className="mb-4">
            {/* <label htmlFor="description" className="block font-medium mb-1">
              Description (Max 50 words):
            </label> */}
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description (Max 50 words)'
              className="border rounded-md px-3 py-2 w-full input-box"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            {/* <label htmlFor="content" className="block font-medium mb-1">
              Content (Max 500 words):
            </label> */}
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Content (Max 500 words)'
              className="border rounded-md px-3 py-2 w-full input-box"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="border rounded-md px-3 py-2 w-full input-box"
            >
              {/* <option value="" disabled selected>Visibility</option> */}
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {visibility === 'private' && (
            <div className="mb-4">
              {/* <label htmlFor="friends" className="block font-medium mb-1">
                Invite Friends:
              </label> */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="friends"
                  value={friendInput}
                  placeholder='Invite Friends'
                  onChange={(e) => setFriendInput(e.target.value)}
                  className="border rounded-md px-3 py-2 w-full input-box"
                />
                <button
                  type="button"
                  onClick={handleAddFriend}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2">
                {friends.map((friend) => (
                  <li key={friend} className="flex items-center justify-between">
                    <span>{friend}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFriend(friend)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-4 flex items-center">
            <label htmlFor="releaseAt" className="font-medium mr-2 text-nowrap">
              Release Date
            </label>
            <input
              type="date"
              id="releaseAt"
              onChange={handleReleaseDate}
              className="border rounded-md px-3 py-2 w-full input-box"
              required
            />
            {dateError && <div className="text-red-500 mt-2">{dateError}</div>}
          </div>

          <div className="mb-4 flex items-center">
            <label htmlFor="media" className="block font-medium mb-1 text-nowrap">
              Upload Media:
            </label>
            <input
              type="file"
              id="media"
              multiple
              onChange={(e) => handleMediaUpload(e.target.files)}
              className="border rounded-md px-3 py-2 w-full input-box"
              required
            />
            {mediaError && <div className="text-red-500 mt-2">{mediaError}</div>}
          </div>

          {formError && <div className="text-red-500 mt-2">{formError}</div>}

          <div className="flex justify-center my-5">
            <button type="submit" className="bg-[#283149] text-white border-2 border-white  hover:bg-white hover:text-[#283149] hover:border-2 hover:border-[#283149]  
          font-bold py-2 px-4 rounded">
              Create Capsule
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 z-50 h-full w-full bg-white bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="loader"></div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Brewcapsule;
