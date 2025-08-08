import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Phone } from 'lucide-react';

export default function Settings({ isOpen, onClose, contacts, onSelectContact, searchTerm, setSearchTerm }) {
  const [newNumber, setNewNumber] = useState("");

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleSelectContact = (contact) => {
    onSelectContact(contact);
    onClose();
  };

  const handleSendToNewNumber = () => {
    if (newNumber.trim()) {
      onSendToNewNumber(newNumber.trim());
      setNewNumber("");
      onClose();
    }
  };

  const formatPhoneNumber = (phone) => {
    return phone;
  };

  return (
    <div>
      <h1>Settings Page</h1>
      <p>Configure your application settings here.</p>
    </div>
  );
}
