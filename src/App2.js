import { useEffect, useState, useRef } from "react";
import "./app.css"; // Create this file for styling

function App() {
  let [comments, setComments] = useState([]);
  let [commentsInFlatStructure, setCommentsInFlatStructure] = useState([]);

  const [mainInputValue, setMainInputValue] = useState("");
  const [childInputValue, setChildInputValue] = useState("");

  let childInputRef = useRef(null); // Create a ref for the child input

  let [replyInputId, setReplyInputId] = useState(null)

  const handleChange = (event) => {
    let inputName = event.target.name

    if (inputName === 'main-input'){
      setMainInputValue(event.target.value)
    } else {
      setChildInputValue(event.target.value)
    }
  };

  function traverseThenAddComment(commentId, node) {

    let commentsCopy = comments;

    if (commentId === "main-input") {
      commentsCopy.push(node);
    } else {
      // Traverse the tree using DFS

      let isVisited = false

      function dfs(comments) {
        for (let i = 0; i < comments.length; i++) {
          // Base case
          if (isVisited === true) {
            return
          }

          if (commentId === comments[i].commentId){
            comments[i].children.push(node)
            isVisited = true
            return
          }

          dfs(comments[i].children);
        }
      }
      dfs(commentsCopy);
    }

    setComments([...commentsCopy]);

    // Clear input
    setMainInputValue('')
    setChildInputValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission

      let inputName = event.target.name;
      let commentId = inputName;

      let inputValue = ''
      if (inputName === 'main-input'){
        inputValue = mainInputValue
      } else {
        inputValue = childInputValue
      }

      let node = {
        commentId: String(Math.random()),
        userId: String(Math.random()),
        body: inputValue,
        children: [],
      };

      traverseThenAddComment(commentId, node);
    }
  };

  function handleShowReplyInput(commentId){
    if (commentId === replyInputId){
      setReplyInputId(null)
      return
    }

    setReplyInputId(commentId)
  }

  useEffect(function (){
    let output = []

    // Traverse the tree using DFS
    function toFlat(comments, level) {
      for (let i = 0; i < comments.length; i++) {
        let a = comments[i]
        a['level'] = level
        output.push(a);

        toFlat(comments[i].children, level + 1);
      }
    }
    toFlat(comments, 0);

    setCommentsInFlatStructure(output)

  }, [comments])

  useEffect(function (){
    if (replyInputId !== null && childInputRef.current) {
      childInputRef.current.focus();
    }
  }, [replyInputId])

  return (
    <div>
      {commentsInFlatStructure.length > 0 &&
        commentsInFlatStructure.map(function (comment) {
          return (
            <div key={comment.commentId} style={{marginLeft:`${comment.level * 2}rem`, marginTop:'0', marginBottom:'20px'}}>
              <p style={{margin:'0'}}>{comment.body}</p>
              <p style={{margin:'0', border:'1px solid lightgray', borderRadius:'10px', backgroundColor:'lightgray', padding:'.1rem', display:'inline-block'}} onClick={function (){handleShowReplyInput(comment.commentId)}}>reply</p>
              
                {comment.commentId === replyInputId &&
                <input style={{display:'block'}} type="text" ref={childInputRef} name={comment.commentId} value={childInputValue} onChange={handleChange} onKeyDown={handleKeyDown} />
                }
              
            </div>
          );
      })}

      <input type="text" name='main-input' value={mainInputValue} onChange={handleChange} onKeyDown={handleKeyDown} />
    </div>
  );
}

export default App;
