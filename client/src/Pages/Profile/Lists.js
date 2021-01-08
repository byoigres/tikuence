import React, { Fragment, useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import styled from "styled-components";
import Layout from "../../components/Layout"
import Window from "../../components/Window"
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  VideoListItemContainer,
  VideoListItemContent,
  VideoListItemImage,
  VideoListItemDescriptions,
  ItemTitle,
  ItemAuthor,
  VideoListItemActions
} from "../../components/VideoListItem";
import ConfirmDialog from "../../components/ConfirmDialog"


const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: "1rem"
  },
  actionArea: {
    display: "flex",
    justifyContent: "flex-start"
  },
  cover: {
    width: 100
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  }
}));


const SuccessMessage = styled.strong`
  display: block;
  background-color: #096d08;
  color: white;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  cursor: pointer;
`;

const List = ({ lists, flash }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItemToDelete, setCurrentItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(flash.success);

  function onDeleteDialogClose() {
    setIsDeleteDialogOpen(false);
  }

  function onDeleteButtonClick(id) {
    setIsDeleteDialogOpen(true);
    setCurrentItemToDelete(id);
  }

  function onDelete() {
    Inertia.delete(`/list/${currentItemToDelete}`, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {},
      onFinish() {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setCurrentItemToDelete(null);
      },
    });
  }

  useEffect(function() {
    setSuccessMessage(flash.success);
  }, [flash.success]);

  function handleDeleteLists(id) {
    Inertia.delete(`/list/${id}`, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {},
      onFinish() {
        setIsLoading(false);
      },
    });
  }
  return (
    <Fragment>
      {successMessage && (
        <SuccessMessage onClick={() => setSuccessMessage(null)}>{successMessage}</SuccessMessage>
      )}
      {lists.map((list) => (
        <Card className={classes.card} key={list.id}>
          <CardActionArea className={classes.actionArea}>
            <CardMedia
              className={classes.cover}
              component="img"
              alt="Contemplative Reptile"
              height="150"
              image={list.videos.length > 0  ? `/images/${list.videos[0].thumbnail_name}` : "https://p16-sign-sg.tiktokcdn.com/obj/tos-maliva-p-0068/cf1952143b1d41038bf8c71d50fd6f14?x-expires=1610067600&x-signature=HpeDgZ%2FwQUr9TfxSagf7AxWB7RA%3D"}
              title="Make Computers Fast Again"
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  Make Computers Fast Again
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  List by byoigres@gmail.com
                </Typography>
              </CardContent>
            </div>
          </CardActionArea>
          <CardActions>
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("delete icon handler")
                  onDeleteButtonClick(list.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton aria-label="edit">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      ))}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onDialogClose={onDeleteDialogClose}
        actionHandler={onDelete}
        title="Confirm"
        description="Are you sure to delete this?"
        actionText="Delete"
        cancelText="Cancel"
      />
    </Fragment>
  );
}
// const List = ({ lists, flash }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState(flash.success);

//   useEffect(function() {
//     setSuccessMessage(flash.success);
//   }, [flash.success]);

//   function handleDeleteLists(id) {
//     Inertia.delete(`/list/${id}`, {
//       onStart() {
//         setIsLoading(true);
//       },
//       onSuccess() {},
//       onFinish() {
//         setIsLoading(false);
//       },
//     });
//   }
//   return (
//     <Fragment>
//       {successMessage && (
//         <SuccessMessage onClick={() => setSuccessMessage(null)}>{successMessage}</SuccessMessage>
//       )}
//       {lists.map((list) => (
//         <VideoListItemContainer key={list.id}>
//           <VideoListItemContent
//             onClick={(e) => {
//               e.preventDefault();
//               Inertia.replace(`/list/1`);
//             }}
//           >
//             {list.videos.length > 0 && (
//               <VideoListItemImage
//                 src={`/images/${list.videos[0].thumbnail_name}`}
//               />
//             )}
//             {list.videos.length === 0 && <strong>This list doesn't have videos yet</strong>}
//             <VideoListItemDescriptions>
//               <ItemTitle>{list.title}</ItemTitle>
//               <ItemAuthor>List by {list.user.email}</ItemAuthor>
//             </VideoListItemDescriptions>
//           </VideoListItemContent>
//           <VideoListItemActions>
//             {!isLoading && (
//               <Fragment>
//                 <i className="fas fa-trash-alt" onClick={(e) => {
//                   e.preventDefault();
//                   handleDeleteLists(list.id);
//                 }}></i>
//                 <i className="fas fa-edit"></i>
//               </Fragment>
//             )}
//             {isLoading && <i>Working...</i>}
//           </VideoListItemActions>
//         </VideoListItemContainer>
//       ))}
//     </Fragment>
//   );
// }

List.layout = page => <Layout children={page} title="My lists" />;

export default List;
