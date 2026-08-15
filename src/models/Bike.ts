import mongoose, { Schema, Document } from 'mongoose';

export interface IBike extends Document {
  title: string;
  brand: string;
  year: number;
  engineCC: string;
  color: string;
  vin: string;
  price: number;
  salePrice?: number;
  status: 'available' | 'sold';
  image: string;
  
  // Buyer Information (Required only when status is 'sold')
  owner?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    idNumber: string;
  };
  soldDate?: string;
  paymentMethod?: string;
}

const BikeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    engineCC: { type: String, required: true },
    color: { type: String, required: true },
    vin: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    image: { type: String, required: true },
    
    owner: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      idNumber: { type: String },
    },
    soldDate: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBike>('Bike', BikeSchema);