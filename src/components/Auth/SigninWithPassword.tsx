"use client"
import { CredType } from "@/api/auth/models"
import { doLogin } from "@/api/auth/requests"
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CRED_INIT = {
  username: "",
  password: "",
}

export default function SigninWithPassword() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<CredType>(CRED_INIT)
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = () => {
    setIsLoading(true)
    doLogin({
      credentials: credentials,
      callback: () => {
        router.replace("/")
        setIsLoading(false)
      },
      errorHandler: (error: AuthError) => {
        setError(error.message)
        setIsLoading(false)
      },
    })
  }

  return (
    <Box className="flex flex-col gap-4">
      <Typography sx={{ width: "100%", textAlign: "center" }} variant={"h5"}>
        Please Sign In
      </Typography>

      <Box className="flex flex-col gap-3">
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

        <Button
          variant={"contained"}
          onClick={handleLogin}
          disabled={!credentials.username || !credentials.password}
          loading={isLoading}
        >
          {"Sign In"}
        </Button>

        {error && <Alert severity={"error"}>{error}</Alert>}
      </Box>
    </Box>
  )
}
