
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save, Mail, User as UserIcon, Smartphone, Key, Info } from "lucide-react";

function ProfileForm({ user, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    full_name: "",
    photo_url: "",
    twilio_phone_number: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        photo_url: user.photo_url || "",
        twilio_phone_number: user.twilio_phone_number || "",
      });
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={formData.photo_url} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xl">
              {getInitials(formData.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <Label htmlFor="photo_url">URL da Foto de Perfil</Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-500" />Nome Completo</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" />Email</Label>
          <Input id="email" value={user.email} disabled />
        </div>

        {/* --- Twilio Configuration Section --- */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Configuração do Número Twilio
          </h3>

          <div className="space-y-2">
            <Label htmlFor="twilio_phone_number">Seu Número Twilio</Label>
            <Input
              id="twilio_phone_number"
              value={formData.twilio_phone_number}
              onChange={(e) => setFormData({ ...formData, twilio_phone_number: e.target.value })}
              placeholder="+18663509407"
            />
            <p className="text-xs text-gray-500">Este número será usado como remetente das suas mensagens.</p>
          </div>

          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-800">Credenciais Seguras</AlertTitle>
            <AlertDescription className="text-blue-700">
              Seu Account SID e Auth Token são armazenados de forma segura no backend da Base44 e não ficam visíveis aqui.
            </AlertDescription>
          </Alert>
        </div>
        {/* --- End Twilio Configuration Section --- */}

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading} className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Save className="w-4 h-4" />
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </form>
  );
}


export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Usuário não autenticado", error);
        // Lidar com usuário não autenticado, talvez redirecionar
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (data) => {
    setIsLoading(true);
    try {
      await User.updateMyUserData(data);
      const updatedUser = await User.me();
      setUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Falha ao atualizar o perfil. Tente novamente.");
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-500" />
            Configurações
          </h1>
          <p className="text-gray-500 mt-1">Gerencie suas informações de perfil e configurações do aplicativo.</p>
        </header>

        <Card className="glass-effect mb-6">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Estas informações serão usadas para identificar você no aplicativo.
            </CardDescription>
          </CardHeader>
          <ProfileForm user={user} onSave={handleSave} isLoading={isLoading} />
        </Card>
        
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Configuração de Dados</CardTitle>
            <CardDescription>
              Seu aplicativo está configurado para usar o banco de dados interno da Base44. Nenhuma configuração externa (como Supabase) é necessária. Suas credenciais do Twilio são gerenciadas de forma segura no backend da plataforma.
            </CardDescription>
          </CardHeader>
           <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tudo Pronto!</AlertTitle>
                <AlertDescription>
                  O sistema de Entidades da Base44 (Contact, Message, etc.) funciona como seu banco de dados. Você pode gerenciar os dados diretamente no painel da Base44.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Contact, Conversation } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ContactCard from "../components/contacts/ContactCard";
import ContactForm from "../components/contacts/ContactForm";

export default function ContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await Contact.list("-created_date");
      setContacts(data);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
    }
  };

  const handleSaveContact = async (contactData) => {
    setIsLoading(true);
    try {
      if (editingContact) {
        await Contact.update(editingContact.id, contactData);
      } else {
        await Contact.create(contactData);
      }
      
      setShowForm(false);
      setEditingContact(null);
      loadContacts();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    }
    setIsLoading(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleMessageContact = async (contact) => {
    try {
      // Check if conversation already exists
      let existingConversations = await Conversation.filter({ contact_id: contact.id });
      
      let conversationId;
      
      if (existingConversations.length > 0) {
        conversationId = existingConversations[0].id;
      } else {
        // Create new conversation
        const newConversation = await Conversation.create({
          contact_id: contact.id,
          last_message: `Iniciando conversa com ${contact.name}`,
          last_message_time: new Date().toISOString(),
          unread_count: 0
        });
        conversationId = newConversation.id;
      }
      
      // Navigate to messages page with conversationId
      navigate(createPageUrl(`Messages?conversationId=${conversationId}`));
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    }
  };

  const handleCallContact = (contact) => {
    // Here you would implement the call functionality
    // For now, we'll just show an alert
    alert(`Ligando para ${contact.name} - ${contact.phone}`);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Contatos
            </h1>
            <p className="text-gray-500 mt-1">{contacts.length} contatos salvos</p>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Contato
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/70 backdrop-blur-sm border-white/50"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center h-full"
              >
                <ContactForm
                  contact={editingContact}
                  onSave={handleSaveContact}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingContact(null);
                  }}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="contacts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {filteredContacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredContacts.map((contact) => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        onEdit={handleEditContact}
                        onMessage={handleMessageContact}
                        onCall={handleCallContact}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato ainda"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? "Tente alterar os termos de busca"
                        : "Adicione seus primeiros contatos para começar"
                      }
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Adicionar Contato
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
