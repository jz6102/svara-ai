"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Input } from '@/components/core/Input';
import { Button } from '@/components/core/Button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      setToken(res.data.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to create account.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-lg">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-center text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}