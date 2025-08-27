import { type User, type InsertUser, type Service, type InsertService, type Booking, type InsertBooking, type Ride, type InsertRide } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: string): Promise<User | undefined>;

  // Services
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Rides
  createRide(ride: InsertRide): Promise<Ride>;
  getUserRides(userId: string): Promise<Ride[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private services: Map<string, Service>;
  private bookings: Map<string, Booking>;
  private rides: Map<string, Ride>;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.rides = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: "user-1",
      username: "demo",
      password: "demo123",
      pointsBalance: "125.50",
      isVerified: true,
      phoneNumber: "+1234567890",
      email: "demo@example.com",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default services
    const defaultServices: Service[] = [
      {
        id: "service-bajaj",
        name: "Bajaj",
        type: "transportation",
        icon: "motorcycle",
        basePrice: "8.50",
        description: "Auto-rickshaw service",
        isActive: true,
      },
      {
        id: "service-taxi",
        name: "Taxi",
        type: "transportation",
        icon: "taxi",
        basePrice: "15.00",
        description: "Traditional taxi service",
        isActive: true,
      },
      {
        id: "service-bus",
        name: "Bus",
        type: "transportation",
        icon: "bus",
        basePrice: "3.50",
        description: "Public bus transportation",
        isActive: true,
      },
      {
        id: "service-business",
        name: "Business",
        type: "transportation",
        icon: "car",
        basePrice: "25.00",
        description: "Premium business rides",
        isActive: true,
      },
      {
        id: "service-delivery",
        name: "Delivery",
        type: "delivery",
        icon: "motorcycle",
        basePrice: "12.00",
        description: "Package delivery service",
        isActive: true,
      },
      {
        id: "service-parcel",
        name: "Parcel",
        type: "delivery",
        icon: "box",
        basePrice: "10.00",
        description: "Parcel delivery service",
        isActive: true,
      },
      {
        id: "service-gas",
        name: "Gas",
        type: "delivery",
        icon: "fire",
        basePrice: "2.50",
        description: "Gas cylinder delivery",
        isActive: true,
      },
      {
        id: "service-food",
        name: "Food",
        type: "food",
        icon: "utensils",
        basePrice: "5.00",
        description: "Food delivery service",
        isActive: true,
      },
    ];

    defaultServices.forEach(service => {
      this.services.set(service.id, service);
    });

    // Create some sample rides
    const sampleRides: Ride[] = [
      {
        id: "ride-1",
        userId: "user-1",
        serviceType: "Taxi",
        destination: "Central Market",
        amount: "12.50",
        status: "completed",
        date: new Date(),
      },
      {
        id: "ride-2",
        userId: "user-1",
        serviceType: "Food",
        destination: "Food Delivery",
        amount: "8.75",
        status: "delivered",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
    ];

    sampleRides.forEach(ride => {
      this.rides.set(ride.id, ride);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      pointsBalance: insertUser.pointsBalance || "0.00",
      isVerified: insertUser.isVerified || false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, points: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.pointsBalance = points;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive);
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = randomUUID();
    const ride: Ride = {
      ...insertRide,
      id,
      date: new Date(),
    };
    this.rides.set(id, ride);
    return ride;
  }

  async getUserRides(userId: string): Promise<Ride[]> {
    return Array.from(this.rides.values())
      .filter(ride => ride.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const storage = new MemStorage();
