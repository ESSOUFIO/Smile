import styles from "./PostFooter.module.css";
import {
  addComment,
  disLikePost,
  likePost,
} from "../../../firebase/interaction";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { calcTime } from "../../../utils/calcTime";
import Comment from "../Comment/Comment";
import AddComment from "../Comment/AddComment";
import PostInteractionsButtons from "../Interactions/PostInteractionsButtons";
import PostInteractionsStats from "../Interactions/PostInteractionsStats";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

export const OtherComments = ({ lastComment, showDetailsPost, postId }) => {
  const postTime = calcTime(lastComment?.time);

  return (
    <>
      {lastComment && (
        <div className={styles.OtherComments}>
          <div className={styles.viewMoreComments} onClick={showDetailsPost}>
            View more comments
          </div>
          <Comment comment={lastComment} postTime={postTime} postId={postId} />
        </div>
      )}
    </>
  );
};

export const CommentsSection = ({ picture, postId, uid, showDetailsPost }) => {
  const [comment, setComment] = useState("");
  const [lastComment, setLastComment] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "interactions", "Comment", "comments"),
      orderBy("time", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      let cmt;
      snap.forEach((doc) => {
        cmt = { id: doc.id, ...doc.data() };
        return;
      });
      setLastComment(cmt);
    });
    return () => unsub();
  }, [postId]);

  const addCommentHandler = useCallback(async () => {
    try {
      await addComment(postId, uid, comment);
      // getLastComment(postId).then((doc) => setLastComment(doc));
      setComment("");
    } catch (error) {}
  }, [comment, postId, uid]);

  useEffect(() => {
    if (comment !== "") {
      const keyDownHandler = (event) => {
        // console.log("User pressed: ", event.key);
        if (event.key === "Enter") {
          event.preventDefault();
          addCommentHandler();
        }
      };
      document.addEventListener("keydown", keyDownHandler);
      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [comment, addCommentHandler]);

  return (
    <div className={styles.CommentsSection}>
      {lastComment && (
        <OtherComments
          postId={postId}
          lastComment={lastComment}
          showDetailsPost={showDetailsPost}
        />
      )}
      <AddComment
        picture={picture}
        comment={comment}
        setComment={setComment}
        addCommentHandler={addCommentHandler}
        isFixed={false}
      />
    </div>
  );
};

/** ======== MAIN ======== */
export const PostFooter = ({ postId, uid, picture, showDetailsPost }) => {
  const [liked, setLiked] = useState(false);

  /** listen Like */
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "posts", postId, "interactions", "Like", "likes", uid),
      (doc) => {
        doc.data() ? setLiked(true) : setLiked(false);
      }
    );
    return unsub;
  }, [postId, uid]);

  /** Interactions handler */
  const btnClicked = async (btn) => {
    try {
      switch (btn) {
        case "Like":
          if (!liked) {
            await likePost(postId, uid);
          } else {
            await disLikePost(postId, uid);
          }
          break;
        case "Comment":
          showDetailsPost();
          break;
        case "Share":
          // code block
          break;
        default:
        // code block
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.PostFooterWrap}>
      <div className={styles.PostFooter}>
        <PostInteractionsStats />
        <PostInteractionsButtons liked={liked} btnClicked={btnClicked} />
        <CommentsSection
          picture={picture}
          postId={postId}
          uid={uid}
          showDetailsPost={showDetailsPost}
        />
      </div>
    </div>
  );
};
