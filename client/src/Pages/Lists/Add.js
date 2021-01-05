import React, { Fragment, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
} from "../../components/Modal";
import Button from "../../components/Button"


const Add = ({ isOpen, closeCallback }) => {
  const { error } = usePage();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    title: "",
    initialVideo: "",
  });

  function handleChange(e) {
    const key = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setValues((values) => ({
      ...values,
      [key]: value,
    }));
  }

  function handleNewList(e) {
    e.preventDefault();
    e.stopPropagation();

    Inertia.post("/list", values, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {
        closeCallback();
      },
      onFinish() {
        setIsLoading(false);
      },
    });
  }

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        onBackgroundClick={closeCallback}
        onEscapeKeydown={closeCallback}
        opacity={1}
        backgroundProps={{ opacity: 1 }}
      >
        <ModalHeader
          title="New list"
          closeCallback={closeCallback}
        />
        <ModalContent>
          {isLoading && <strong>Enviando...</strong>}
          {error && (
            <div>
              <strong>{error}</strong>
            </div>
          )}
          <input
            id="title"
            name="title"
            autoFocus
            value={values.title}
            onChange={handleChange}
            autoComplete="off"
            required
            disabled={isLoading}
          />
        </ModalContent>
        <ModalActions>
          <Button type="button" onClick={handleNewList}>
            Create List
          </Button>
        </ModalActions>
      </Modal>
    </Fragment>
  );
};

export default Add;
