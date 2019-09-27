import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import authFetchRequest from '../../utils/auth/cognitoFetchRequest';
import Nav from '../../components/nav';
import styled from './index.module.scss';

function ArtifactView(props) {
  const [artifact, setArtifact] = useState(undefined);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const { registerId, artifactId } = props.match.params;
  // TODO: write a hook to replicate useEffect authenticated fetch
  useEffect(() => {
    if (registerId !== null && artifactId !== null) {
      authFetchRequest(`https://api.airloom.xyz/api/v1/register/artifact/${registerId}/${artifactId}`, {})
        .then(data => {
          if (data.length === 0) {
            setErrorState(true);
            setHasLoaded(true);
          } else {
            const artifactData = data[0];
            setArtifact(artifactData);
            setPhotoCount(artifactData.photos.length);
            setHasLoaded(true);
          }
        })
        .catch(err => {
          setErrorState(true);
          setHasLoaded(true);
        });
    }
  }, [registerId, artifactId]);
  if (!hasLoaded) {
    return <div className="loading">Loading your request</div>;
  }
  if (errorState) {
    return <div className="error">Something went wrong with your request, woops</div>;
  }

  function nextPhoto() {
    setPhotoIndex((photoIndex + 1) % photoCount);
  }
  
  function prevPhoto() {
    setPhotoIndex((photoIndex + photoCount - 1) % photoCount);
  }

  function addPhoto() {
    // TODO
  }

  return (
    <>
      <Nav registerId={registerId} />
      <div className={styled["container"]}>
      <div className={styled["name"]}>{artifact.name}</div> 
      <div className={styled["artifact-container"]}>
        <div className={styled["column"]}>
          <div className={styled["photo-container"]}>
            <img className={styled["photo"]} 
                  src={photoCount !== 0 ? artifact.photos[photoIndex].url : null} 
                  alt=""/>
          </div>
          <button onClick={prevPhoto}>&larr;</button>
          { artifact.is_admin
              ? <button onClick={undefined}>+</button>
              : <></> 
          }
          <button onClick={addPhoto}>&rarr;</button>
        </div>
        <div className={styled["column"]}>
          {[{ title:"Location", data:(artifact.lat + ", " + artifact.lon) },
            { title:"Date", data:((new Date(artifact.date)).toDateString()) },
            { title:"Family Members", data:artifact.family_members },
            { title:"Description", data:artifact.description }
           ].map(({title, data}) => (<>
              <div className={styled["title"]}>{title}</div>
              <div className={styled["data"]}>{data}</div>
            </>))
          }
        </div>
      </div>
      </div>
    </>
  );
}
  
ArtifactView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      registerId: PropTypes.string.isRequired,
      artifactId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired
};

export default ArtifactView;
