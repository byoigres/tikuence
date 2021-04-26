import React, { useState, Fragment } from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const useStyles = makeStyles(() => ({}));

const TitleForUpdate = ({ id, title: initialTitle, canEdit = true, isLoading }) => {
  const {
    props: { errors },
  } = usePage();
  const classes = useStyles();
  const [title, setTitle] = useState(initialTitle);
  const [isEditMode, setIsEditMode] = useState(false);

  function onTitleUpdate() {
    Inertia.put(
      `/list/${id}`,
      { title },
      {
        only: ['auth', 'flash', 'errors', 'referer', 'showModal', 'title'],
        onSuccess() {
          setIsEditMode(false);
        },
      }
    );
  }

  function hadleTitleUpdate(e) {
    e.preventDefault();
    onTitleUpdate();
  }

  function changeEditMode() {
    setTitle(initialTitle);
    setIsEditMode(!isEditMode);
  }

  function onTitleChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  function handleOnKeyPress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onTitleUpdate();
    }
  }

  return (
    <>
      {!isEditMode && (
        <Grid container direction="row" wrap="nowrap" alignItems="center">
          <Typography component="h1" variant="h6">
            {title}
          </Typography>
          {canEdit && (
            <IconButton onClick={changeEditMode}>
              <EditIcon />
            </IconButton>
          )}
        </Grid>
      )}
      {isEditMode && (
        <Grid container direction="column" wrap="nowrap" alignItems="center">
          <TextField
            id="title"
            name="title"
            value={title}
            autoFocus
            onChange={onTitleChange}
            onKeyPress={handleOnKeyPress}
            fullWidth
            autoComplete="off"
            required
            error={errors.title !== undefined}
            helperText={errors.title}
            disabled={isLoading}
          />
          <Grid container item md={12} justify="flex-end">
            <Button
              className={classes.titleButtons}
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                setIsEditMode(!isEditMode);
                setTitle(initialTitle);
                Inertia.reload({
                  only: ['auth', 'flash', 'errors', 'referer', 'showModal', 'title'],
                  replace: true,
                });
              }}
            >
              Cancel
            </Button>
            <Button
              className={classes.titleButtons}
              color="primary"
              disabled={isLoading}
              onClick={hadleTitleUpdate}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default TitleForUpdate;
