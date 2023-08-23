// para criar o context
import { createContext, useState } from 'react';

export const UsuarioContext = createContext();
UsuarioContext.displayName = "Usuário"

export const UsuarioProvider = ({ children }) => {
  const [nome, setNome] = useState('')
  const [saldo, setSaldo] = useState(0)

  return (
    <UsuarioContext.Provider value={{ nome, setNome, saldo, setSaldo }}>
      {children}
    </UsuarioContext.Provider>
  )
}