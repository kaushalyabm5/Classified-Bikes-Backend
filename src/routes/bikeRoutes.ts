import { Router, Request, Response } from 'express';
import Bike from '../models/Bike.js';

const router = Router();

// 1. Get All Bikes (Optionally filter by status: available or sold)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter = status ? { status: status.toString() } : {};
    const bikes = await Bike.find(filter).sort({ createdAt: -1 });
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bikes', error });
  }
});

// 2. Get Single Bike Detail by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      res.status(404).json({ message: 'Bike not found' });
      return;
    }
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bike details', error });
  }
});

// 3. Add New Available Bike
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const newBike = new Bike(req.body);
    const savedBike = await newBike.save();
    res.status(201).json(savedBike);
  } catch (error) {
    res.status(400).json({ message: 'Error creating new bike record', error });
  }
});

// 4. Sell Bike Endpoint (Updates status to 'sold' and records buyer information)
router.put('/:id/sell', async (req: Request, res: Response): Promise<void> => {
  try {
    const { salePrice, owner, soldDate, paymentMethod } = req.body;

    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      res.status(404).json({ message: 'Bike not found' });
      return;
    }

    bike.status = 'sold';
    bike.salePrice = salePrice;
    bike.owner = owner;
    bike.soldDate = soldDate || new Date().toISOString().split('T')[0];
    bike.paymentMethod = paymentMethod || 'Cash';

    const updatedBike = await bike.save();
    res.json({ message: 'Bike marked as sold successfully', bike: updatedBike });
  } catch (error) {
    res.status(500).json({ message: 'Error processing bike sale', error });
  }
});

// 5. Remove / Delete Bike Permanently
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);
    if (!deletedBike) {
      res.status(404).json({ message: 'Bike not found' });
      return;
    }
    res.json({ message: 'Bike deleted permanently from the system' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bike record', error });
  }
});

export default router;