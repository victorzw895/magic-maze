import {useState, createContext, useContext, ReactNode, Dispatch, SetStateAction} from 'react';

const AssetsContext = createContext<{ assets: any; setAssets: Dispatch<SetStateAction<any>> } | undefined>(undefined)

const AssetsProvider = ({children}: {children: ReactNode}) => {
  const [assets, setAssets] = useState(null);

  const value = {assets, setAssets};

  return (
    <AssetsContext.Provider value={value}>
      {children}
    </AssetsContext.Provider>
  )
}

const useAssets = () => {
  const context = useContext(AssetsContext)
  if (context === undefined) {
    throw new Error('useAssets must be used within a AssetsContext');
  }
  return context;
}

export { 
  AssetsProvider,
  useAssets,
};