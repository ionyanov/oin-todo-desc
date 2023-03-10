import React, {useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from "react-bootstrap/AccordionItem";
import {observer} from "mobx-react-lite";
import ControlPanel from "./components/controlPannel";
import ModalTask from "./components/modalTask";
import {DragDropContext} from "react-beautiful-dnd";
import Column from "./components/column";
import {useBoard} from "./hoocks/useBoard";

const App = observer(() => {
    const {board} = useBoard();
    const [modalVisible, setModalVisible] = useState(false)

    const handleRemove = () => {
        if (window.confirm('Are you really want to remove epic?')) {
            board.deleteCurEpic();
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        board.setTaskState(result.draggableId, result.destination.droppableId);
    };

    return (
        <>
            <ControlPanel/>
            <ModalTask show={modalVisible} onHide={() => setModalVisible(false)}/>
            <Accordion activeKey={board.curEpic}
                       onSelect={(event) => {
                           board.setCurEpic(event)
                       }}>
                {board.epics?.map((epic, index) => {
                    if (epic) {
                        return <AccordionItem eventKey={index} key={index}>
                            <Accordion.Header>{index} {epic}</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex">
                                    <button className="mx-3 my-2 btn btn-outline-success form-control"
                                            onClick={() => setModalVisible(true)}>Add task
                                    </button>
                                    <button className="mx-3 my-2 btn btn-outline-danger form-control"
                                            onClick={handleRemove}>Remove epic
                                    </button>
                                </div>
                                <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
                                    <div className='d-flex'>
                                        {board.statuses.map(tag => (
                                            <Column key={tag} tag={tag}/>
                                        ))}
                                    </div>
                                </DragDropContext>
                            </Accordion.Body>
                        </AccordionItem>
                    }
                })}
            </Accordion>
        </>
    );
});

export default App;
