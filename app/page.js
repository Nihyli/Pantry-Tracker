'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { AppBar, Box, Button, Container, Modal, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { query, collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [namesList, setNamesList] = useState([]); // State to hold names list

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    // Extract names into list
    setNamesList(inventoryList.map(item => item.name));
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth={false} sx={{ padding: 0, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#3C3B44'}}>
      <AppBar position="absolute" sx={{ width: '100%', bgcolor: '#3C3B44'}}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pantry Manager
          </Typography>
          <Button 
            color="inherit" sx={{ color: '#ADD8E6' }}
            onClick={() => window.location.href = 'https://www.yohannes.dev'}
          >
            Portfolio
          </Button>
        </Toolbar>
      </AppBar>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flex: 1 // This makes the content box take up the remaining space
        }}
      >
        <Modal open={open} onClose={handleClose}>
          <Box 
            sx={{
              position: 'absolute',
              top: '50%', 
              left: '50%',
              width: 400,
              bgcolor: 'white',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              transform: 'translate(-50%, -50%)',
              borderRadius: '8px'
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>

        <Box sx={{ borderRadius: '8px' }}>
          <Box 
            sx={{
              width: '800px',
              height: '100px',
              bgcolor: '#FFF2CB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px 8px 0 0',
              mb: '16px'
            }}
          > 
            <Typography variant="h2" color="#333">
              Pantry Items
            </Typography>
          </Box>
          <Stack sx={{ width: '800px', height: '300px', spacing: 2, overflow: 'auto' }}>
            {inventory.map(({ name, quantity }) => (
              <Box 
                key={name}
                sx={{
                  width: '100%', 
                  minHeight: '125px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  bgcolor: '#f0f0f0', 
                  padding: 5,
                  mb: 1.5,
                  borderRadius: '8px'
                }}
              > 
                <Typography 
                  variant='h4' 
                  color='#333' 
                  textAlign="center"
                  sx={{ width: '200px' }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                
                <Typography 
                  variant='h4' 
                  color='#333' 
                  textAlign="center"
                  sx={{ width: '100px' }}
                >
                  {quantity}
                </Typography>

                <Button 
                  variant="contained"
                  onClick={() => addItem(name)}
                >
                  +
                </Button>

                <Button 
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  -
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
