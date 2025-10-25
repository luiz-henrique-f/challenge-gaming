import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormData } from "@/login/schemas/authSchema";
import { Eye, EyeOff } from "lucide-react";

interface RegisterProps {
  onSuccess?: () => void;
}

export default function Register({ onSuccess }: RegisterProps) {
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: RegisterFormData) {
  setIsLoading(true);
  
  try {
    await registerUser(data.name, data.username, data.password);
    
    form.reset();
    
    if (onSuccess) {
      onSuccess();
    }
    
    toast.success("Conta criada com sucesso! Faça login para continuar.");
    
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message?.includes("Network Error")) {
      toast.error("Erro de conexão. Verifique sua internet.");
    } else {
      toast.error("Erro ao registrar usuário. Tente novamente.");
    }
  } finally {
    setIsLoading(false);
  }
}

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Nome completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome completo"
                  {...field}
                  className="bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">E-mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...field}
                  className="bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Crie uma senha segura"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Dicas de senha */}
        <div className="p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-xs text-blue-300 font-medium mb-2">Sua senha deve conter:</p>
          <ul className="text-xs text-blue-200 space-y-1">
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                form.watch('password')?.length >= 8 ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              Pelo menos 8 caracteres
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[A-Z]/.test(form.watch('password') || '') ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              Uma letra maiúscula
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[a-z]/.test(form.watch('password') || '') ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              Uma letra minúscula
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /\d/.test(form.watch('password') || '') ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              Um número
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[@$!%*?&]/.test(form.watch('password') || '') ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              Um caractere especial (@$!%*?&)
            </li>
          </ul>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 cursor-pointer"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>

        {/* Informações de segurança */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Suas informações estão protegidas com criptografia
          </p>
        </div>
      </form>
    </Form>
  );
}