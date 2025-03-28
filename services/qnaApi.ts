// ✅ services/qnaApi.ts - Firestore CRUD API 함수 모음

import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';

// 📘 질문 등록
export const addQnaPost = async (post: {
    title: string;
    content: string;
    authorEmail: string;
    authorId: string;
}) => {
    await addDoc(collection(db, 'qna'), {
        ...post,
        createdAt: serverTimestamp(),
    });
};

// 📘 질문 전체 조회 (최신순)
export const getAllQnaPosts = async () => {
    const q = query(collection(db, 'qna'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 📘 질문 상세 조회
export const getQnaPostById = async (id: string) => {
    const ref = doc(db, 'qna', id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// 📘 질문 수정
export const updateQnaPost = async (
    id: string,
    data: { title: string; content: string }
) => {
    const ref = doc(db, 'qna', id);
    await updateDoc(ref, data);
};

// 📘 질문 삭제
export const deleteQnaPost = async (id: string) => {
    const ref = doc(db, 'qna', id);
    await deleteDoc(ref);
};

// 📘 댓글 등록
export const addCommentToQna = async (
    postId: string,
    comment: {
        content: string;
        authorEmail: string;
        authorId: string;
        parentId: string | null;
        createdAt: Date;
    }
) => {
    const ref = collection(db, 'qna', postId, 'comments');
    await addDoc(ref, comment);
};

// 📘 댓글 조회
export const getCommentsForQna = async (postId: string) => {
    const q = query(
        collection(db, 'qna', postId, 'comments'),
        orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 📘 댓글 삭제
export const deleteCommentFromQna = async (
    postId: string,
    commentId: string
) => {
    const ref = doc(db, 'qna', postId, 'comments', commentId);
    await deleteDoc(ref);
};
