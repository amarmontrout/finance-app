"use client"

import { CredType } from "@/app/api/Auth/models"
import { doLogin } from "@/app/api/Auth/requests"
import { FlexColWrapper } from "@/components/Wrappers"
import { accentColorSecondary } from "@/globals/colors"
import { 
  Alert,
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  Typography 
} from "@mui/material"
import { AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CRED_INIT = {
  username: "",
  password: ""
}

const LoginForm = () => {
  const router = useRouter()
  const [credentials, setCredentials] = useState<CredType>(CRED_INIT)
  const [error, setError] = useState<string | undefined>()

  const handleLogin = () => {
    doLogin({
      credentials: credentials,
      router: router,
      errorHandler: (error: AuthError) => {
        setError(error.message)
      }
    })
  }

  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Card
        style={{
          borderRadius: "15px",
          margin: "0 auto"
        }}
      >
        <CardContent>
          <FlexColWrapper gap={5}>
            <Typography textAlign={"center"}>
              Please Sign In
            </Typography>

            {error && <Alert severity={"error"}>{error}</Alert>}

            <Box className="flex flex-col gap-3 m-auto">
              <FormControl>
                <InputLabel>Username</InputLabel>
                <OutlinedInput
                  label={"Username"}
                  value={credentials.username}
                  name={"username"}
                  onChange={(e) => {
                    setCredentials(prev => ({
                      ...prev,
                      username: e.target.value
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
                    setCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }))
                  }}
                  />
              </FormControl>

              <Button
                variant={"contained"} 
                onClick={handleLogin}
                disabled={!credentials.username || !credentials.password}
                sx={{ backgroundColor: accentColorSecondary }}
              >
                {"Sign In"}
              </Button>
            </Box>
          </FlexColWrapper>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginForm