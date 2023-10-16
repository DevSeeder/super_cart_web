import React, { useState, ChangeEvent } from 'react';
import { Input, Button, List as SemanticList, Icon, Grid, Label, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styles from '../styles/Home.module.css';

interface Item {
  text: string;
  edited: boolean;
  risked: boolean;
  category: string;
  value: number | undefined;
  quantity: number;
  measure: string;
}

const measureOptions = [
  { key: 'unidade', text: 'Unidade', value: 'unidade' },
  { key: 'kg', text: 'Kg', value: 'kg' },
  { key: 'g', text: 'g', value: 'g' },
  { key: 'pc', text: 'Pc', value: 'pc' },
  { key: 'caixa', text: 'Cx', value: 'caixa' },
  { key: 'pacote', text: 'Pacote', value: 'pacote' },
  { key: 'litro', text: 'Litro', value: 'litro' },
  { key: 'garrafa', text: 'Garrafa', value: 'garrafa' },
  { key: 'metro', text: 'm', value: 'metro' },
  { key: 'cm', text: 'cm', value: 'cm' },
  { key: 'ml', text: 'ml', value: 'ml' },
  { key: 'mm', text: 'mm', value: 'mm' },
];

const categoryOptions = [
  { key: 'geral', text: 'Geral', value: 'geral' },
  { key: 'carne', text: 'Carnes', value: 'carne' },
  { key: 'verdurasLegumes', text: 'Verduras e Legumes', value: 'verdurasLegumes' },
  { key: 'lacticínios', text: 'Lacticínios', value: 'lacticínios' },
  { key: 'frutas', text: 'Frutas', value: 'frutas' },
  { key: 'bebidas', text: 'Bebidas', value: 'bebidas' },
  { key: 'padaria', text: 'Padaria', value: 'padaria' },
  { key: 'congelada', text: 'Comida Congelada', value: 'congelada' },
  { key: 'mercearia', text: 'Mercearia', value: 'mercearia' },
  { key: 'pet', text: 'Petshop', value: 'pet' },
  { key: 'ferramentas', text: 'Ferramentas', value: 'ferramentas' },
  { key: 'cozinha', text: 'Cozinha', value: 'cozinha' },
  { key: 'eletro', text: 'Eletrodomésticos', value: 'eletro' },
];

const List: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [inputCategory, setInputCategory] = useState<string>('geral');
  const [inputValueValue, setInputValueValue] = useState<number>();
  const [inputQuantity, setInputQuantity] = useState<number>(1);
  const [inputMeasure, setInputMeasure] = useState<string>('unidade');
  const [editedValues, setEditedValues] = useState<Item>({
    text: '',
    edited: false,
    category: '',
    value: 0,
    quantity: 1,
    measure: 'unidade',
    risked: false
  }); 

    // Função para validar se a entrada é um número
    const isValidNumber = (value: string) => /^\d+$/.test(value);

    // Função para atualizar os valores editados
    const handleEditValueChange = (e: ChangeEvent<HTMLInputElement>, setValue: any) => {
      const value = e.target.value;
      if (isValidNumber(value)) {
        setValue(value);
      }

      if(!value){
        setValue('')
      }
    };

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      const newItem: Item = {
        risked: false,
        text: inputValue.trim(),
        edited: false,
        category: inputCategory,
        value: inputValueValue,
        quantity: inputQuantity,
        measure: inputMeasure,
      };
      setItems([...items, newItem]);
      setInputValue('');
      setInputCategory('geral');
      setInputValueValue(0);
      setInputQuantity(1);
      setInputMeasure('unidade');
    }
  };

  const handleEditItem = (index: number) => {
    setEditIndex(index);
    const item = items[index];

    setInputValue(item.text);
    setInputCategory(item.category);
    setInputValueValue(item.value);
    setInputQuantity(item.quantity);
    setInputMeasure(item.measure);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const item = items[editIndex];

      items[editIndex] = {
        text: inputValue,
        edited: true,
        risked: item.risked,
        category: inputCategory,
        value: inputValueValue,
        quantity: inputQuantity,
        measure: inputMeasure,
      };

      setItems(items);
      setEditIndex(null);
      setInputValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setInputValue('');
  };

  const handleToggleCompleted = (index: number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, risked: !item.risked } : item
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
        <div>
          <div style={{ width: '100%', marginBottom: '2%'}}>
            <Input
              style={{ width: '100%' }}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div>
              <Grid columns={2} stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Dropdown
                      style={{ width: '100%'}}
                      selection
                      value={inputCategory}
                      options={categoryOptions}
                      onChange={(e, { value }) => setInputCategory(value as string)}
                      placeholder='Selecione a Categoria'
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      fluid
                      label={<Label basic color='teal'>Valor</Label>}
                      type="text"
                      value={inputValueValue}
                      onChange={(e) => handleEditValueChange(e, setInputValueValue)}
                      placeholder="Valor"
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Input
                      fluid
                      label={<Label basic color='teal'>Quantidade</Label>}
                      type="text"
                      value={inputQuantity}
                      onChange={(e) => handleEditValueChange(e, setInputQuantity)}
                      placeholder="Quantidade"
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Dropdown
                      style={{ width: '100%'}}
                      selection
                      value={inputMeasure}
                      options={measureOptions}
                      onChange={(e, { value }) => setInputMeasure(value as string)}
                      placeholder='Selecione a Medida'
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <div style={{ marginTop: '2%'}}>
              {editIndex == null && (
                <Button
                  icon
                  floated='right'
                  color="green"
                  labelPosition="left"
                  className={styles.addButton}
                  onClick={handleAddItem}
                >
                  <Icon name="plus" />
                  Adicionar Item
                </Button>
              )}
            </div>
          {editIndex !== null && (
            <>
              <Button
                icon
                labelPosition="left"
                color="green"
                className={styles.button}
                onClick={handleSaveEdit}
              >
                <Icon name="save" />
                Salvar
              </Button>
              <Button
                className={styles.cancelButton}
                onClick={handleCancelEdit}
              >
                <Icon name="remove" />
                Cancelar
              </Button>
            </>
          )}
          </div>
        </div>
        <div className={styles.separatorContainer}></div>
      </div>
      <div className={styles.listContainer}>
        <SemanticList divided relaxed className={styles.list}>
          {items.map((item, index) => (
            <SemanticList.Item
              key={index}
              className={`${styles.listItem} ${
                item.edited ? styles.completed : ''
              } ${item.risked ? styles.marked : ''}`}
            >
              <SemanticList.Content>
                <div>
                  <h3>{item.text}</h3>
                  <Label> Categoria: {item.category}</Label>
                  <Label> Valor: {item.value}</Label>
                  <Label> Quantidade: {item.quantity}</Label>
                  <Label> Medida: {item.measure}</Label>
                </div>
              </SemanticList.Content>
              <SemanticList.Content floated="right" style={{ marginTop: '2%'}}>
                <Button
                  icon
                  color="orange"
                  labelPosition="left"
                  className={styles.editButton}
                  onClick={() => handleEditItem(index)}
                  disabled={editIndex !== null}
                >
                  <Icon name="edit" />
                  Editar
                </Button>
                <Button
                  icon
                  color="blue"
                  labelPosition="left"
                  className={styles.completeButton}
                  onClick={() => handleToggleCompleted(index)}
                >
                  <Icon name={!item.risked ? 'check' : 'remove'} />
                  {!item.risked ? 'Marcar' : 'Desmarcar'}
                </Button>
                <Button
                  icon
                  color="red"
                  labelPosition="left"
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(index)}
                >
                  <Icon name="trash" />
                  Remover
                </Button>
              </SemanticList.Content>
            </SemanticList.Item>
          ))}
        </SemanticList>
      </div>
    </div>
  );
};

export default List;
