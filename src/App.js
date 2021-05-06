import React, { Component, useState } from 'react';
import './App.css';

// Import Amplify and Storage
import Amplify, { Storage } from 'aws-amplify';
// withAuthenticator is a higher order component that wraps the application with a login page
import { withAuthenticator } from '@aws-amplify/ui-react';
// Import the project config files and configure them with Amplify
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName]=useState(null);



  const downloadUrl = async () => {
    // Creates download url that expires in 5 minutes/ 300 seconds
    const downloadUrl = await Storage.get(`${fileName}`, { expires: 300 });
    window.location.href = downloadUrl
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    console.log(file.name)
    try {
      setLoading(true);
      // Upload the file to s3 with private access level. 
      await Storage.put(file.name, file, {
        level: 'public',
        contentType: 'video'
      });
      // Retrieve the uploaded file to display
      const url = await Storage.get(`${file.name}`)
      setFileName(file.name)
      setVideoUrl(url);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <h1>My Videos</h1>
      <h1> Upload an Video </h1>
      {loading ? <h3>Uploading...</h3> : <input
        type="file" accept='video/*'
        onChange={(evt) => handleChange(evt)}
      />}
      <br></br>
      <div>
        {videoUrl ? <video controls type="video/mp4" style={{ width: "30rem" }} src={videoUrl} /> : <span />}
      </div>
      <div>
        <h2>Download URL?</h2>
        <button onClick={() => downloadUrl()}>Click Here!</button>
      </div>
    </div>
  );
}

// withAuthenticator wraps your App with a Login component
export default withAuthenticator(App);