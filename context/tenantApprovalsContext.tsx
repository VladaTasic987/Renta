import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react';
import { supabase } from '@/utils/supabase';
import { useTenant } from '@/context/authContextTenant';
import AsyncStorage from
  '@react-native-async-storage/async-storage';

interface TenantApproval {
  id: string;
  owner_id: string;
  approved: boolean;
}

interface TenantApprovalsContextType {
  approvals: TenantApproval[];
  requestApproval: (
    ownerId: string
  ) => Promise<void>;
  refreshApprovals: () => Promise<void>;
}

const TenantApprovalsContext =
  createContext<
    TenantApprovalsContextType | undefined
  >(undefined);

export const TenantApprovalsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user } = useTenant();
  const [approvals, setApprovals] =
    useState<TenantApproval[]>([]);

  const APPROVALS_KEY = 'TENANT_APPROVALS';

  const loadApprovals = async () => {
    if (!user?.id) return;

    try {
      const stored =
        await AsyncStorage.getItem(
          `${APPROVALS_KEY}_${user.id}`
        );

      if (stored) {
        setApprovals(JSON.parse(stored));
      }

      const { data, error } =
        await supabase
          .from('tenant_approvals')
          .select('id, owner_id, approved')
          .eq('tenant_id', user.id);

      if (error) throw error;

      const approvalsData =
        data as TenantApproval[];

      setApprovals(approvalsData);

      await AsyncStorage.setItem(
        `${APPROVALS_KEY}_${user.id}`,
        JSON.stringify(approvalsData)
      );
    } catch (err) {
      console.log(
        'LOAD APPROVALS ERROR:',
        err
      );
      setApprovals([]);
    }
  };

  const refreshApprovals = async () => {
    await loadApprovals();
  };

  const requestApproval = async (
    ownerId: string
  ) => {
    if (!user?.id) {
      console.log(
        'Tenant nije ulogovan'
      );
      return;
    }

    try {
      const {
        data: existing,
        error: existingError,
      } = await supabase
        .from('tenant_approvals')
        .select('id')
        .eq('tenant_id', user.id)
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (existing) {
        console.log(
          'Zahtev već postoji'
        );
        return;
      }
      if (existingError)
        throw existingError;

      const {
        data: newApproval,
        error: insertError,
      } = await supabase
        .from('tenant_approvals')
        .insert([
          {
            tenant_id: user.id,
            owner_id: ownerId,
            approved: false,
          },
        ])
        .select()
        .maybeSingle();

      if (insertError)
        throw insertError;

      const updatedApprovals = [
        ...approvals,
        newApproval as TenantApproval,
      ];

      setApprovals(updatedApprovals);

      await AsyncStorage.setItem(
        `${APPROVALS_KEY}_${user.id}`,
        JSON.stringify(
          updatedApprovals
        )
      );
    } catch (err) {
      console.log(
        'REQUEST APPROVAL ERROR:',
        err
      );
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [user?.id]);

  return (
    <TenantApprovalsContext.Provider
      value={{
        approvals,
        requestApproval,
        refreshApprovals,
      }}
    >
      {children}
    </TenantApprovalsContext.Provider>
  );
};

export const useTenantApprovals = () => {
  const ctx =
    useContext(TenantApprovalsContext);

  if (!ctx) {
    throw new Error(
      'useTenantApprovals must be used within TenantApprovalsProvider'
    );
  }
  return ctx;
};
