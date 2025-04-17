import React, { useState, useRef, useEffect } from 'react';
import { Paper, Title, ActionIcon, Group, Button } from '@mantine/core';
import { IconTrash, IconArrowBack } from '@tabler/icons-react';
import './styles.css';

export function Canvas({ selectedSneakers, onRemoveSneaker, onClose }) {
    const [draggingItems, setDraggingItems] = useState({});
    const canvasRef = useRef(null);

    // Update position of dragged item
    const handleDragStart = (e, sneakerId) => {
        // Save current position to know the offset
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setDraggingItems({
            ...draggingItems,
            [sneakerId]: { offsetX, offsetY, isDragging: true }
        });
    };

    const handleDragMove = (e, sneakerId) => {
        if (!draggingItems[sneakerId]?.isDragging) return;

        const { offsetX, offsetY } = draggingItems[sneakerId];
        const canvasRect = canvasRef.current.getBoundingClientRect();

        // Calculate position relative to canvas
        const x = e.clientX - canvasRect.left - offsetX;
        const y = e.clientY - canvasRect.top - offsetY;

        // Update position
        setDraggingItems({
            ...draggingItems,
            [sneakerId]: { ...draggingItems[sneakerId], x, y, isDragging: true }
        });
    };

    const handleDragEnd = (sneakerId) => {
        setDraggingItems({
            ...draggingItems,
            [sneakerId]: { ...draggingItems[sneakerId], isDragging: false }
        });
    };

    // Initialize positions for new sneakers
    useEffect(() => {
        selectedSneakers.forEach(sneaker => {
            if (!draggingItems[sneaker.id]) {
                // Set default position for new items in a single row
                const index = selectedSneakers.findIndex(s => s.id === sneaker.id);

                setDraggingItems(prev => ({
                    ...prev,
                    [sneaker.id]: {
                        x: 100 + index * 220,
                        y: 100,
                        offsetX: 0,
                        offsetY: 0,
                        isDragging: false
                    }
                }));
            }
        });
    }, [selectedSneakers]);

    // Handle remove sneaker with stopPropagation
    const handleRemoveSneaker = (e, sneakerId) => {
        e.stopPropagation(); // Prevent event from bubbling up to parent
        onRemoveSneaker(sneakerId);
    };

    return (
        <div className="canvas-container">
            <Paper shadow="md" p="md" className="canvas-controls">
                <Group position="apart">
                    <Button
                        leftIcon={<IconArrowBack size={16} />}
                        variant="subtle"
                        onClick={onClose}
                    >
                        Back to Collection
                    </Button>
                    <Title order={3}>Sneaker Canvas</Title>
                </Group>
            </Paper>

            <div
                ref={canvasRef}
                className="canvas-area"
            >
                {selectedSneakers.map(sneaker => {
                    const position = draggingItems[sneaker.id] || { x: 50, y: 50 };

                    return (
                        <div
                            key={sneaker.id}
                            className="canvas-item"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px)`,
                                cursor: position.isDragging ? 'grabbing' : 'grab'
                            }}
                            onMouseDown={(e) => handleDragStart(e, sneaker.id)}
                            onMouseMove={(e) => handleDragMove(e, sneaker.id)}
                            onMouseUp={() => handleDragEnd(sneaker.id)}
                            onMouseLeave={() => handleDragEnd(sneaker.id)}
                        >
                            <img
                                src={sneaker.image}
                                alt={sneaker.title}
                                className="canvas-sneaker-image"
                            />
                            <ActionIcon
                                color="red"
                                variant="filled"
                                className="remove-btn"
                                onClick={(e) => handleRemoveSneaker(e, sneaker.id)}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 