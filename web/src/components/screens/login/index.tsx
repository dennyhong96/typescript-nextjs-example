import React, { useRef, FormEvent, useEffect } from "react";
import NextLink from "next/link";
import { Input, Stack, Box, Text, Button, useToast, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useAuth } from "@contexts/auth";

const LoginScreen = () => {
  const toast = useToast();
  const { user, login } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const email = emailRef.current?.value;
    const password = emailRef.current?.value;

    if (!email || !password) {
      return toast({
        title: "Missing credentials.",
        description: "Please enter email and password",
        status: "error",
        isClosable: true,
      });
    }

    try {
      await login({ email, password });
      emailRef.current && (emailRef.current.value = "");
      passwordRef.current && (passwordRef.current.value = "");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        toast({
          title: "Unabled to login.",
          description: "User not found, please sign up.",
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box
      css={`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
      `}
    >
      <Box
        css={`
          width: 100%;
          max-width: 350px;
        `}
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <Box>
              <Text as="label" htmlFor="email" fontSize="sm">
                Username
              </Text>
              <Input ref={emailRef} type="email" placeholder="Username" id="email" />
            </Box>
            <Box>
              <Text as="label" htmlFor="password" fontSize="sm">
                Password
              </Text>
              <Input ref={passwordRef} type="password" placeholder="Password" id="password" />
            </Box>
            <Button colorScheme="teal" type="submit">
              Login
            </Button>
            <NextLink href="/auth/signup" passHref>
              <Link color="teal.500" size="sm">
                Don&apos;t have an account? Signup.
              </Link>
            </NextLink>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default LoginScreen;
