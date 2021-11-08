import React from 'react';
import {makeImgPath} from "../utils";
import styled from "styled-components";

const Image = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
`;

interface PosterPrors {
    path: string;
}

const Poster: React.FC<PosterPrors> = ({path}) => {
    return <Image source={{uri: makeImgPath(path)}}/>;
};

export default Poster;