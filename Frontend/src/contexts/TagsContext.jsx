// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : [
      "Hair",
      "Skin",
      "Fruit",
      "Vegetable",
      "Pet",
    ];
  });

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const addTag = (newTag) => {
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const deleteTag = (TagToDelete) => {
    setTags((prevTags) =>
      prevTags.filter(tags => tags !== TagToDelete)
    );
  };

  return (
    <TagsContext.Provider value={{ tags, addTag, deleteTag }}>
      {children}
    </TagsContext.Provider>
  );
};

TagsProvider.propTypes = {
  children: PropTypes.node,
};

export default TagsContext;

// import React, { createContext, useState, useEffect } from "react";
// import PropTypes from 'prop-types';

// const TagsContext = createContext();

// export const TagsProvider = ({ children }) => {
//   const [tags, setTags] = useState(() => {
//     const savedTags = localStorage.getItem('tags');
//     return savedTags ? JSON.parse(savedTags) : [
//       "Hair",
//       "Skin",
//       "Fruit",
//       "Vegetable",
//       "Pet",
//     ];
//   });

//   useEffect(() => {
//     localStorage.setItem('tags', JSON.stringify(tags));
//   }, [tags]);

//   const addTag = (newTag) => {
//     setTags((prevTags) => [...prevTags, newTag]);
//   };

//   return (
//     <TagsContext.Provider value={{ tags, addTag }}>
//       {children}
//     </TagsContext.Provider>
//   );
// };

// TagsProvider.propTypes = {
//   children: PropTypes.node,
// };

// export default TagsContext;
