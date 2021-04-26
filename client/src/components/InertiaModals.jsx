import React, { Suspense, lazy as ReactLazy } from 'react';

const AddNewList = ReactLazy(() => import('../Pages/Lists/Add'));
const List = ReactLazy(() => import('../Pages/Lists/List'));
const AddVideo = ReactLazy(() => import('../Pages/Lists/AddVideo'));
const EditProfile = ReactLazy(() => import('../Pages/Profile/Edit'));

const InertiaModals = ({ modal }) => (
  <Suspense fallback={<div>Loading...</div>}>
    {modal && modal.modalName === 'add-list' && <AddNewList pageReferer={modal.referer} />}
    {modal && modal.modalName === 'list' && <List pageReferer={modal.referer} />}
    {modal && modal.modalName === 'add-video' && <AddVideo />}
    {modal && modal.modalName === 'edit-profile' && <EditProfile />}
  </Suspense>
);

export default InertiaModals;
