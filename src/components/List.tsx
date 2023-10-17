import React, { useState, ChangeEvent } from 'react';
import { Input, Button, List as SemanticList, Icon, Grid, Label, Dropdown, SemanticCOLORS, SemanticICONS, Message, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styles from '../styles/Home.module.css';
import Papa from 'papaparse';

interface Item {
  text: string;
  edited: boolean;
  risked: boolean;
  category: string;
  value: number | undefined;
  quantity: number;
  measure: string;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const measureOptions = [
  { key: 'unidade', text: 'Unidade(s)', value: 'unidade' },
  { key: 'kg', text: 'Kg', value: 'kg' },
  { key: 'g', text: 'g', value: 'g' },
  { key: 'pc', text: 'Pc', value: 'pc' },
  { key: 'caixa', text: 'Cx', value: 'caixa' },
  { key: 'pacote', text: 'Pacote(s)', value: 'pacote' },
  { key: 'litro', text: 'Litro(s)', value: 'litro' },
  { key: 'garrafa', text: 'Garrafa(s)', value: 'garrafa' },
  { key: 'metro', text: 'm', value: 'metro' },
  { key: 'cm', text: 'cm', value: 'cm' },
  { key: 'ml', text: 'ml', value: 'ml' },
  { key: 'mm', text: 'mm', value: 'mm' },
];

const categoryOptions = [
  { key: 'geral', text: 'Geral', value: 'geral', icon: 'archive', color: 'grey' },
  { key: 'carne', text: 'Carnes', value: 'carne', icon: 'food', color: 'brown' },
  { key: 'verdurasLegumes', text: 'Verduras e Legumes', value: 'verdurasLegumes', icon: 'leaf', color: 'green' },
  { key: 'lacticínios', text: 'Lacticínios', value: 'lacticínios', icon: 'gulp', color: 'yellow' },
  { key: 'frutas', text: 'Frutas', value: 'frutas', icon: 'lemon', color: 'orange' },
  { key: 'bebidas', text: 'Bebidas', value: 'bebidas', icon: 'glass martini', color: 'teal' },
  { key: 'padaria', text: 'Padaria', value: 'padaria', icon: 'coffee', color: 'olive' },
  { key: 'congelada', text: 'Comida Congelada', value: 'congelada', icon: 'snowflake', color: 'blue' },
  { key: 'mercearia', text: 'Mercearia', value: 'mercearia', icon: 'shopping cart', color: 'violet' },
  { key: 'pet', text: 'Petshop', value: 'pet', icon: 'paw', color: 'purple' },
  { key: 'ferramentas', text: 'Ferramentas', value: 'ferramentas', icon: 'wrench', color: 'pink' },
  { key: 'cozinha', text: 'Cozinha', value: 'cozinha', icon: 'spoon', color: 'red' },
  { key: 'eletro', text: 'Eletrodomésticos', value: 'eletro', icon: 'plug', color: 'black' },
];

const List: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [inputCategory, setInputCategory] = useState<string>('geral');
  const [inputValueValue, setInputValueValue] = useState<number>();
  const [inputQuantity, setInputQuantity] = useState<number>(1);
  const [inputMeasure, setInputMeasure] = useState<string>('unidade');
  const [showValidationMessage, setShowValidationMessage] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>('');

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

    if(inputValue.trim() === ''){
      setShowValidationMessage(true);
      setMessageError('Por favor preencha a descrição do item.');
      return;
    }

    if(!Number(inputQuantity) || isNaN(Number(inputQuantity))){
      setShowValidationMessage(true);
      setMessageError('Informe a quantidade.');
      return;
    }

    setShowValidationMessage(false);

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

  const getTotalMarked = () => {
    return items.reduce((total, item) => {
      if (item.risked) {
        return total + (item.value || 0) * item.quantity;
      }
      return total;
    }, 0);
  };

  const getTotalAll = () => {
    return items.reduce((total, item) => {
      return total + (item.value || 0) * item.quantity;
    }, 0);
  };

  const handleExportText = () => {
    if (!items.length) return;

    const content = items.map((item, index) => 
      `${index + 1}. ${item.text} (${item.quantity}x) - ${item.value ? formatCurrency(Number(item.value) * item.quantity) : ''}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_de_compras.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowExportModal(false); // Feche o modal após a exportação
  };

  // Função para exportar como CSV
  const handleExportCSV = () => {
    if (!items.length) return;

    const csvContent = Papa.unparse({
      fields: ['Descrição', 'Categoria', 'Valor', 'Quantidade', 'Medida'],
      data: items.map(item => [item.text, item.category, item.value || '', item.quantity, item.measure]),
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista_de_compras.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setShowExportModal(false); 
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
              placeholder="Descrição"
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
            {showValidationMessage && (
                <div style={{marginTop: '12%', background: 'red', color: 'red'}}>
                  <Message negative>
                    <Message.Header>Erro de validação</Message.Header>
                    <p>{messageError}</p>
                  </Message>
                </div>
              )}
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
          <div className={styles.totalContainer}>
            <div>
              <div style={{ fontSize: 18, textDecoration: 'underline'}}>
                <b>Total Geral: </b> 
                <span style={{color: 'red'}}>{formatCurrency(getTotalAll())}</span>
              </div>
              <br/>
              <div style={{ fontSize: 18}}>
                <b>Total Marcado: </b> 
                <span style={{color: 'red'}}>{formatCurrency(getTotalMarked())}</span>
              </div>
              <br/>
              <div style={{ fontSize: 18}}>
                <b>Total Restante: </b> 
                <span style={{color: 'red'}}>{formatCurrency(getTotalAll() - getTotalMarked())}</span>
              </div>
            </div>
          </div>
          <div style={{marginTop: '5%'}}>
            <Button
              icon
              color="blue"
              labelPosition="left"
              disabled={items.length === 0}
              className={styles.exportButton}
              onClick={() => setShowExportModal(true)}
            >
              <Icon name="download" />
              Exportar Lista
            </Button>
          </div>
          <Modal open={showExportModal}>
            <Modal.Header>Exportar Lista</Modal.Header>
            <Modal.Content>
              <p>Escolha o formato de exportação:</p>
              <Button
                color='green'
                onClick={handleExportText}
              >
                <Icon name='file text' /> Exportar como Texto
              </Button>
              <Button
                color='blue'
                onClick={handleExportCSV}
              >
                <Icon name='file excel outline' /> Exportar como CSV
              </Button>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => {setShowExportModal(false)}}>
                <Icon name='remove' /> Cancelar
              </Button>
            </Modal.Actions>
        </Modal>
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
                  <Label 
                    style={{ float: 'right'}}
                    color={categoryOptions.filter(cat => cat.value === item.category)[0].color as SemanticCOLORS}
                  > 
                    <Icon name={categoryOptions.filter(cat => cat.value === item.category)[0].icon as SemanticICONS } />
                    {categoryOptions.filter(cat => cat.value === item.category)[0].text}
                  </Label>
                  <h3>{item.text}</h3>
                </div>
              </SemanticList.Content>
              <SemanticList.Content>
                <div style={{ marginTop: '2%'}}>
                <div style={{ float: 'left'}}>
               {item.value ? 
                (
                  <Label color='blue'>
                    {formatCurrency(Number(item.value) * Number(item.quantity))}
                  </Label>
                ): ''}
                <Label color='green'> 
                  {item.quantity} {measureOptions.filter(m => m.value === item.measure)[0].text}
                </Label>
                {item.value && item.quantity > 1 ? 
                (
                  <Label>
                    {item.quantity + ' x ' + formatCurrency(Number(item.value))}
                  </Label>
                ): ''}
               </div>
                <div style={{ float: 'right'}}>
                <Button
                  icon
                  size='tiny'
                  color="orange"
                  className={styles.editButton}
                  onClick={() => handleEditItem(index)}
                  disabled={editIndex !== null}
                >
                  <Icon name="edit" />
                </Button>
                <Button
                  icon
                  size='tiny'
                  color="blue"
                  className={styles.completeButton}
                  onClick={() => handleToggleCompleted(index)}
                >
                  <Icon name={!item.risked ? 'check' : 'remove'} />
                </Button>
                <Button
                  icon
                  size='tiny'
                  color="red"
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(index)}
                >
                  <Icon name="trash" />
                </Button>
                </div>
                </div>
              </SemanticList.Content>
            </SemanticList.Item>
          ))}
        </SemanticList>
      </div>
    </div>
  );
};

export default List;
