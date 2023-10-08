import React, { useState, ChangeEvent } from 'react';
import { Input, Button, List as SemanticList, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styles from '../styles/Home.module.css';

interface Item {
  text: string;
  edited: boolean;
}

const List: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, { text: inputValue.trim(), edited: false }]);
      setInputValue('');
    }
  };

  const handleEditItem = (index: number) => {
    setEditIndex(index);
    setInputValue(items[index].text);
  };

  const handleSaveEdit = () => {
    const updatedItems = items.map((item, index) =>
      index === editIndex ? { ...item, text: inputValue, edited: true } : item
    );
    setItems(updatedItems);
    setEditIndex(null);
    setInputValue('');
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setInputValue('');
  };

  const handleToggleCompleted = (index: number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, edited: !item.edited } : item
    );
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Compras</h1>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          action={
            editIndex !== null ? (
              <>
                <Button
                  icon labelPosition='left' color='green'
                  className={styles.button} onClick={handleSaveEdit}>
                  <Icon name='save'/>
                  Salvar
                </Button>
                <Button className={styles.cancelButton} onClick={handleCancelEdit}>
                  <Icon name='remove'/>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button icon color='green' labelPosition='left' className={styles.addButton} onClick={handleAddItem}>
                <Icon name='plus' />
                Adicionar Item
              </Button>
            )
          }
        />
      </div>
      <SemanticList divided relaxed className={styles.list}>
        {items.map((item, index) => (
          <SemanticList.Item
            key={index}
            className={`${styles.listItem} ${item.edited ? styles.completed : ''} ${item.edited ? styles.marked : ''}`}
          >
            <SemanticList.Content>
              {editIndex === index ? (
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{item.text}</span>
              )}
            </SemanticList.Content>
            <SemanticList.Content floated="right">
              <Button
                icon color='orange' labelPosition='left' 
                className={styles.editButton}
                onClick={() => handleEditItem(index)}
                disabled={editIndex !== null}
              >
                <Icon name='edit'/>
                Editar
              </Button>
              <Button
                icon color='blue' labelPosition='left' 
                className={styles.completeButton}
                onClick={() => handleToggleCompleted(index)}
              >
                <Icon name={!item.edited ? 'check' : 'remove'}/> 
                {item.edited ? 'Desmarcar' : 'Marcar'}
              </Button>
              <Button
                icon color='red' labelPosition='left' 
                className={styles.removeButton}
                onClick={() => handleRemoveItem(index)}
              >
                <Icon name='trash'/>
                Remover
              </Button>
            </SemanticList.Content>
          </SemanticList.Item>
        ))}
      </SemanticList>
    </div>
  );
};

export default List;
