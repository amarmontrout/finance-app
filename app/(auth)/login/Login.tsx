"use client"

import { CredType } from "@/app/(api)/auth/models"
import { doLogin } from "@/app/(api)/auth/requests"
import Section from "@/app/components/Section"
import Surface from "@/app/components/ui/Surface"
import { HookSetter } from "@/app/lib/types"
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"

import { useState } from "react"

const CRED_INIT = {
  username: "",
  password: "",
}

const handleLogin = ({
  credentials,
  setIsLoading,
  setError,
  router,
}: {
  credentials: CredType
  setIsLoading: HookSetter<boolean>
  setError: HookSetter<string | undefined>
  router: AppRouterInstance
}) => {
  setIsLoading(true)
  doLogin({
    credentials: credentials,
    callback: () => {
      router.replace("/")
      setError(undefined)
      setIsLoading(false)
    },
    errorHandler: (error: AuthError) => {
      setError(error.message)
      setIsLoading(false)
    },
  })
}

export default function Login() {
  const router = useRouter()

  const [credentials, setCredentials] = useState<CredType>(CRED_INIT)
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <Surface>
      <Section>
        <Typography sx={{ width: "100%", textAlign: "center" }} variant={"h5"}>
          Please Log In
        </Typography>
      </Section>

      <Section>
        <Stack direction={"column"} spacing={3}>
          {error && <Alert severity={"error"}>{error}</Alert>}

          <Stack direction={"column"} spacing={1}>
            <FormControl>
              <InputLabel>Username</InputLabel>
              <OutlinedInput
                label={"Username"}
                value={credentials.username}
                name={"username"}
                onChange={(e) => {
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }}
              />
            </FormControl>

            <FormControl>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label={"Password"}
                type={"password"}
                value={credentials.password}
                name={"password"}
                onChange={(e) => {
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }}
              />
            </FormControl>
          </Stack>
          <Button
            variant={"contained"}
            size={"large"}
            onClick={() =>
              handleLogin({
                credentials: credentials,
                setIsLoading: setIsLoading,
                setError: setError,
                router: router,
              })
            }
            disabled={!credentials.username || !credentials.password}
            loading={isLoading}
          >
            Log In
          </Button>
        </Stack>
      </Section>
    </Surface>
  )
}
